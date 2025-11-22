from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.profile_routes import profile_routes
import mysql.connector
import os
from datetime import datetime, timedelta
import jwt

# JWT secret for token generation (override with env var in production)
JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret-key-change-in-production')

app = Flask(__name__)
# Enable CORS for React frontend (allow all in dev)
CORS(app)

# Register the profile routes
app.register_blueprint(profile_routes)

# Database configuration
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Aditya@123',
            database='user_auth'
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None


# -----------------------
# Authentication endpoints
# -----------------------
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}

    email = data.get('email')
    # frontend sends 'name' field - use it as username when provided
    username = data.get('username') or data.get('name') or (email.split('@')[0] if email else None)
    password = data.get('password')
    role = data.get('role', 'faculty')

    department = data.get('department')
    employee_id = data.get('employeeId') or data.get('employee_id')
    phone = data.get('phoneNumber') or data.get('phone')

    if not all([email, username, password]):
        return jsonify({'success': False, 'message': 'email, name and password are required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)

        # check existing
        cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'User already exists'}), 409

        # insert into users - prefer columns username,email,password,role
        try:
            cursor.execute(
                "INSERT INTO users (username, email, password, role, created_at) VALUES (%s, %s, %s, %s, NOW())",
                (username, email, password, role)
            )
        except Exception:
            # fallback to simpler columns if schema differs
            cursor.execute(
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                (username, email, password)
            )

        conn.commit()
        user_id = cursor.lastrowid

        # create a profile record if user_profiles table exists
        try:
            cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='user_profiles'", (os.environ.get('DB_NAME','user_auth'),))
            cols = [r['COLUMN_NAME'] if isinstance(r, dict) else r[0] for r in cursor.fetchall()]
            if cols:
                # insert minimal profile record
                insert_cols = ['user_id']
                insert_vals = [user_id]
                if 'name' in cols:
                    insert_cols.append('name')
                    insert_vals.append(username)
                if 'email' in cols:
                    insert_cols.append('email')
                    insert_vals.append(email)
                if 'role' in cols:
                    insert_cols.append('role')
                    insert_vals.append(role)
                if 'department' in cols and department:
                    insert_cols.append('department')
                    insert_vals.append(department)
                if 'phone' in cols and phone:
                    insert_cols.append('phone')
                    insert_vals.append(phone)
                if 'employee_id' in cols and employee_id:
                    insert_cols.append('employee_id')
                    insert_vals.append(employee_id)

                placeholders = ','.join(['%s'] * len(insert_vals))
                q = f"INSERT INTO user_profiles ({','.join(insert_cols)}) VALUES ({placeholders})"
                cursor.execute(q, tuple(insert_vals))
                conn.commit()
        except Exception:
            # ignore profile creation errors
            pass

        # Return created user (minimal) + JWT token
        cursor.execute("SELECT id, username, email, role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        # generate token
        try:
            token_payload = {
                'user_id': user_id,
                'username': username,
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=7)
            }
            token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')
        except Exception:
            token = None

        cursor.close()
        conn.close()

        return jsonify({'success': True, 'message': 'User registered', 'user': user, 'token': token}), 201

    except Exception as e:
        print(f"Registration error: {e}")
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, role, password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            # try username login
            cursor.execute("SELECT id, username, email, role, password FROM users WHERE username = %s", (email,))
            user = cursor.fetchone()

        if not user:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

        # basic password check (plain-text) - recommend hashing in production
        stored = user.get('password') or user.get('password_hash') or user.get('password_hash')
        if stored != password:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

        # return user without password + token
        user.pop('password', None)

        try:
            token_payload = {
                'user_id': user['id'],
                'username': user.get('username'),
                'email': user.get('email'),
                'exp': datetime.utcnow() + timedelta(days=7)
            }
            token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')
        except Exception:
            token = None

        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Login successful', 'user': user, 'token': token}), 200

    except Exception as e:
        print(f"Login error: {e}")
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current authenticated user from JWT token"""
    try:
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Missing or invalid token'}), 401

        token = auth_header.split(' ')[1]
        
        # Decode JWT token
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401

        user_id = payload.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'Invalid token payload'}), 401

        # Fetch user from database
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        return jsonify({'success': True, 'user': user}), 200

    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users for notification dropdown"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email FROM users ORDER BY username ASC")
        users = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'users': users
        })

    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/leave', methods=['POST'])
def create_leave():
    data = request.get_json()
    
    # Extract data from request
    start_date = data.get('from')
    end_date = data.get('to')
    leave_type = data.get('type')
    note = data.get('note')
    username = data.get('username', 'adi')  # default to 'adi' if no username

    # Validate required fields
    if not all([start_date, end_date, leave_type]):
        return jsonify({
            'success': False,
            'error': 'Missing required fields'
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'error': 'Database connection failed'
        }), 500

    try:
        cursor = conn.cursor()

        # Get user id for given username
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'success': False, 'error': 'user-not-found'}), 404
        uid = row[0]

        # compute days
        try:
            d1 = datetime.strptime(start_date, '%Y-%m-%d').date()
            d2 = datetime.strptime(end_date, '%Y-%m-%d').date()
            days_val = (d2 - d1).days + 1
        except Exception:
            days_val = None

        # Inspect actual leave_requests columns in this DB and map payload accordingly
        cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='leave_requests'", (os.environ.get('DB_NAME','user_auth'),))
        db_cols = [r[0] for r in cursor.fetchall()]

        insert_cols = []
        insert_vals = []

        # requester_id or user_id
        if 'requester_id' in db_cols:
            insert_cols.append('requester_id')
            insert_vals.append(uid)
        elif 'user_id' in db_cols:
            insert_cols.append('user_id')
            insert_vals.append(uid)

        # start/end
        if 'start_date' in db_cols:
            insert_cols.append('start_date')
            insert_vals.append(start_date)
        if 'end_date' in db_cols:
            insert_cols.append('end_date')
            insert_vals.append(end_date)

        # days: compute if DB expects it and no default/generation
        if 'days' in db_cols:
            insert_cols.append('days')
            insert_vals.append(days_val)

        # note
        if 'note' in db_cols:
            insert_cols.append('note')
            insert_vals.append(note)

        # notify - frontend may send notify as string or array
        notify_payload = data.get('notify')
        if 'notify' in db_cols:
            insert_cols.append('notify')
            # store as JSON string if it's a list/dict, else store raw value
            if notify_payload is None:
                insert_vals.append(None)
            else:
                try:
                    import json as _json
                    insert_vals.append(_json.dumps(notify_payload))
                except Exception:
                    insert_vals.append(str(notify_payload))
        else:
            # try to add notify column if payload present and DB user has privileges
            if notify_payload is not None:
                try:
                    cursor.execute("ALTER TABLE leave_requests ADD COLUMN notify JSON NULL")
                    conn.commit()
                    # add to our local list and include value
                    insert_cols.append('notify')
                    try:
                        import json as _json
                        insert_vals.append(_json.dumps(notify_payload))
                    except Exception:
                        insert_vals.append(str(notify_payload))
                except Exception:
                    # unable to alter table - continue without notify
                    pass

        # leave_type -> try leave_type or leave_type_id
        if 'leave_type' in db_cols:
            insert_cols.append('leave_type')
            insert_vals.append(leave_type)
        elif 'leave_type_id' in db_cols:
            insert_cols.append('leave_type_id')
            insert_vals.append(None)

        # status
        if 'status' in db_cols:
            insert_cols.append('status')
            insert_vals.append('Pending')

        if not insert_cols:
            return jsonify({'success': False, 'error': 'no-insertable-columns'}), 500

        placeholders = ','.join(['%s'] * len(insert_vals))
        q = f"INSERT INTO leave_requests ({','.join(insert_cols)}) VALUES ({placeholders})"
        cursor.execute(q, tuple(insert_vals))
        conn.commit()
        leave_id = cursor.lastrowid

        return jsonify({'success': True, 'id': leave_id}), 201

    except Exception as e:
        print('Error creating leave:', e)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass

@app.route('/api/leaves', methods=['GET'])
def get_leaves():
    username = request.args.get('username')
    
    if not username:
        return jsonify({
            'success': False,
            'error': 'Username is required'
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'error': 'Database connection failed'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Get leaves for the user
        query = """
        SELECT lr.*, u.username 
        FROM leave_requests lr
        JOIN users u ON lr.user_id = u.id
        WHERE u.username = %s
        ORDER BY lr.created_at DESC
        """
        cursor.execute(query, (username,))
        leaves = cursor.fetchall()
        
        # Convert datetime objects to strings for JSON serialization
        for leave in leaves:
            leave['created_at'] = leave['created_at'].isoformat() if leave['created_at'] else None
            leave['updated_at'] = leave['updated_at'].isoformat() if leave['updated_at'] else None
            leave['start_date'] = leave['start_date'].isoformat() if leave['start_date'] else None
            leave['end_date'] = leave['end_date'].isoformat() if leave['end_date'] else None
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'leaves': leaves
        })

    except Exception as e:
        print(f"Error fetching leaves: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    conn = get_db_connection()
    if conn:
        conn.close()
        return jsonify({'status': 'healthy', 'database': 'connected'})
    return jsonify({'status': 'unhealthy', 'database': 'disconnected'}), 500

# Profile API endpoints
@app.route('/api/profile', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    if not username:
        return jsonify({'success': False, 'error': 'Username is required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Get user profile with leave balances
        query = """
        SELECT p.*, 
               GROUP_CONCAT(
                   JSON_OBJECT(
                       'type', lb.leave_type,
                       'days', lb.days_available
                   )
               ) as leave_balances
        FROM user_profiles p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN leave_balances lb ON p.user_id = lb.user_id AND lb.year = YEAR(CURRENT_DATE)
        WHERE u.username = %s
        GROUP BY p.id
        """
        cursor.execute(query, (username,))
        profile = cursor.fetchone()
        
        if not profile:
            return jsonify({'success': False, 'error': 'Profile not found'}), 404

        # Convert leave_balances string to JSON array
        if profile['leave_balances']:
            profile['leave_balances'] = eval('[' + profile['leave_balances'] + ']')
        else:
            profile['leave_balances'] = []

        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'profile': profile
        })

    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/profile', methods=['POST', 'PUT'])
def update_profile():
    data = request.get_json()
    username = data.get('username')
    
    if not username:
        return jsonify({'success': False, 'error': 'Username is required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Get user_id
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        user_id = user['id']
        
        # Update or insert profile
        fields = [
            'name', 'email', 'role', 'department', 'joining_date',
            'qualification', 'specialization', 'phone', 'gender', 'profile_image'
        ]
        
        values = []
        set_clause = []
        for field in fields:
            if field in data:
                set_clause.append(f"{field} = %s")
                values.append(data[field])
        
        if not values:
            return jsonify({'success': False, 'error': 'No fields to update'}), 400
            
        values.append(user_id)  # for WHERE clause
        
        query = f"""
        INSERT INTO user_profiles (user_id, {', '.join(fields)})
        VALUES (%s, {', '.join(['%s'] * len(values))})
        ON DUPLICATE KEY UPDATE
        {', '.join(set_clause)}
        """
        
        cursor.execute(query, [user_id] + values)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        })

    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5000)
