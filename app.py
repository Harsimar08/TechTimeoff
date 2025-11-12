from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.profile_routes import profile_routes
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)
# Enable CORS for React frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}})

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
    app.run(debug=True, port=5000)
