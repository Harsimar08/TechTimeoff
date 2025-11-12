from flask import Blueprint, request, jsonify
from db import get_db_connection
import mysql.connector
from datetime import datetime

profile_routes = Blueprint('profile_routes', __name__)

@profile_routes.route('/api/profile', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    if not username:
        return jsonify({'success': False, 'error': 'Username is required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # First get the user_id
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        # Get the profile data
        cursor.execute("""
            SELECT * FROM user_profiles 
            WHERE user_id = %s
        """, (user['id'],))
        
        profile = cursor.fetchone()
        
        if profile:
            # Convert date objects to strings for JSON
            if 'joining_date' in profile:
                profile['joining_date'] = profile['joining_date'].isoformat()
            if 'created_at' in profile:
                profile['created_at'] = profile['created_at'].isoformat()
            if 'updated_at' in profile:
                profile['updated_at'] = profile['updated_at'].isoformat()
                
            return jsonify({
                'success': True,
                'profile': profile
            })
        else:
            # Return default profile if none exists
            return jsonify({
                'success': True,
                'profile': {
                    'name': username,
                    'email': '',
                    'role': '',
                    'department': '',
                    'joining_date': datetime.now().date().isoformat(),
                    'qualification': '',
                    'specialization': '',
                    'phone': '',
                    'gender': 'Other'
                }
            })

    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@profile_routes.route('/api/profile', methods=['POST'])
def update_profile():
    data = request.json
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

        # Check if profile exists
        cursor.execute("SELECT id FROM user_profiles WHERE user_id = %s", (user['id'],))
        profile_exists = cursor.fetchone() is not None

        if profile_exists:
            # Update existing profile
            update_query = """
                UPDATE user_profiles 
                SET name = %s,
                    email = %s,
                    role = %s,
                    department = %s,
                    joining_date = %s,
                    qualification = %s,
                    specialization = %s,
                    phone = %s,
                    gender = %s,
                    profile_image = %s
                WHERE user_id = %s
            """
        else:
            # Insert new profile
            update_query = """
                INSERT INTO user_profiles 
                (name, email, role, department, joining_date, qualification, specialization, phone, gender, profile_image, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

        # Prepare values for query
        values = (
            data.get('name', ''),
            data.get('email', ''),
            data.get('role', ''),
            data.get('department', ''),
            data.get('joining_date') or datetime.now().date().isoformat(),
            data.get('qualification', ''),
            data.get('specialization', ''),
            data.get('phone', ''),
            data.get('gender', 'Other'),
            data.get('profile_image', None),
            user['id']
        )

        cursor.execute(update_query, values)
        conn.commit()

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        })

    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close() 