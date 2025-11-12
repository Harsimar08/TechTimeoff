"""
Seed script for TechTimeoff database.
Usage (PowerShell):
  $env:DB_HOST='localhost'; $env:DB_USER='root'; $env:DB_PASSWORD='Aditya@123'; python .\scripts\seed_db.py

This script creates an example admin user (if not present) and a sample leave request.
"""
import os
import mysql.connector
from werkzeug.security import generate_password_hash
from datetime import date, timedelta

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Aditya@123')
DB_NAME = os.environ.get('DB_NAME', 'user_auth')

conn = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)
cursor = conn.cursor()

# Ensure database exists
cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
conn.commit()

# Connect to the database
conn.database = DB_NAME

# Create tables if schema file wasn't run
with open(os.path.join(os.path.dirname(__file__), '..', 'db_schema.sql'), 'r', encoding='utf-8') as f:
    schema_sql = f.read()
for stmt in schema_sql.split(';'):
    stmt = stmt.strip()
    if not stmt:
        continue
    try:
        cursor.execute(stmt)
    except Exception:
        # ignore statements that can't run in this split method (e.g., multi-line constructs)
        pass
conn.commit()

# Create admin user if not exists
admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
admin_password = os.environ.get('ADMIN_PASSWORD', 'password')
admin_email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')

cursor.execute("SELECT id FROM users WHERE username = %s", (admin_username,))
row = cursor.fetchone()
if row:
    print(f"Admin user '{admin_username}' already exists (id={row[0]}).")
else:
    hashed = generate_password_hash(admin_password)
    cursor.execute("INSERT INTO users (username, password, full_name, email, role) VALUES (%s,%s,%s,%s,%s)",
                   (admin_username, hashed, 'Administrator', admin_email, 'admin'))
    conn.commit()
    print(f"Created admin user '{admin_username}'.")
    cursor.execute("SELECT id FROM users WHERE username = %s", (admin_username,))
    row = cursor.fetchone()

admin_id = row[0]

# Insert a sample leave request for admin (only if none exist)
cursor.execute("SELECT COUNT(*) FROM leave_requests WHERE user_id=%s", (admin_id,))
count = cursor.fetchone()[0]
if count == 0:
    start = date.today() + timedelta(days=3)
    end = start + timedelta(days=2)
    cursor.execute(
        "INSERT INTO leave_requests (user_id, start_date, end_date, leave_type, note, notify, status) VALUES (%s,%s,%s,%s,%s,%s,%s)",
        (admin_id, start, end, 'Earned Leave', 'Sample seed leave request', '[]', 'Pending')
    )
    conn.commit()
    print("Inserted sample leave request for admin.")
else:
    print(f"Admin already has {count} leave request(s); skipping sample insert.")

cursor.close()
conn.close()
print('Seeding complete.')
