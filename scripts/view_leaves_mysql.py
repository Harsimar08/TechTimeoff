import mysql.connector
from datetime import datetime

# Database connection details
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = 'Aditya@123'
DB_NAME = 'user_auth'

print("\nMySQL Commands to view data manually:")
print("-" * 50)
print("1. Open MySQL command prompt and enter these commands:")
print("""
    mysql -u root -p
    When prompted for password, enter: Aditya@123

2. Then run these commands:
    USE user_auth;
    
    -- View all leave requests:
    SELECT * FROM leave_requests;
    
    -- View leaves with usernames:
    SELECT l.*, u.username 
    FROM leave_requests l 
    JOIN users u ON l.requester_id = u.id;
    
    -- View today's leaves:
    SELECT l.*, u.username 
    FROM leave_requests l 
    JOIN users u ON l.requester_id = u.id 
    WHERE DATE(l.created_at) = CURDATE();
""")

# Also show the current data
try:
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = conn.cursor(dictionary=True)
    
    print("\nCurrent Leave Requests in Database:")
    print("-" * 50)
    
    # Get leave requests with usernames
    cursor.execute("""
        SELECT l.*, u.username 
        FROM leave_requests l 
        JOIN users u ON l.requester_id = u.id 
        ORDER BY l.created_at DESC
    """)
    
    leaves = cursor.fetchall()
    
    for leave in leaves:
        print(f"\nLeave Request ID: {leave['id']}")
        print(f"Username: {leave['username']}")
        print(f"Start Date: {leave['start_date']}")
        print(f"End Date: {leave['end_date']}")
        print(f"Status: {leave['status']}")
        print(f"Note: {leave['note']}")
        print(f"Created At: {leave['created_at']}")
        print("-" * 30)
    
    cursor.close()
    conn.close()

except mysql.connector.Error as err:
    print(f"Error: {err}")