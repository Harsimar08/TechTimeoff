"""
End-to-end test script.
Usage:
  $env:API_BASE='http://localhost:5000'; $env:DB_HOST='localhost'; $env:DB_USER='root'; $env:DB_PASSWORD='Aditya@123'; $env:DB_NAME='user_auth'; python .\scripts\test_e2e.py

What it does:
- Calls POST /api/login with TEST_USERNAME/TEST_PASSWORD (env or defaults: admin/password)
- Calls POST /api/leave to create a leave
- Connects to MySQL and queries the leave_requests table for the created leave

Note: run this while Flask server is running and MySQL accessible.
"""
import os
import requests
import mysql.connector
from datetime import date, timedelta

API_BASE = os.environ.get('API_BASE', 'http://localhost:5000')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Aditya@123')
DB_NAME = os.environ.get('DB_NAME', 'user_auth')
TEST_USERNAME = os.environ.get('TEST_USERNAME', 'admin')
TEST_PASSWORD = os.environ.get('TEST_PASSWORD', 'password')

def api_login(session, username, password):
    url = f"{API_BASE}/api/login"
    r = session.post(url, json={'username': username, 'password': password}, timeout=10)
    r.raise_for_status()
    return r.json()

def api_create_leave(session, payload):
    url = f"{API_BASE}/api/leave"
    r = session.post(url, json=payload, timeout=10)
    r.raise_for_status()
    return r.json()

def query_db_for_leave(conn, username, start_date):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id FROM users WHERE username=%s", (username,))
    row = cur.fetchone()
    if not row:
        raise RuntimeError('user not found in DB')
    uid = row['id']
    # Some schemas use `user_id`, others use `requester_id`. Try both.
    try:
        cur.execute("SELECT * FROM leave_requests WHERE user_id=%s AND start_date=%s ORDER BY created_at DESC", (uid, start_date))
        rows = cur.fetchall()
    except Exception:
        # fallback to requester_id column
        try:
            cur.execute("SELECT * FROM leave_requests WHERE requester_id=%s AND start_date=%s ORDER BY created_at DESC", (uid, start_date))
            rows = cur.fetchall()
        except Exception:
            # give up and return empty
            rows = []
    cur.close()
    return rows


def main():
    session = requests.Session()
    print('Logging in...')
    login_res = api_login(session, TEST_USERNAME, TEST_PASSWORD)
    if not login_res.get('success'):
        print('Login failed:', login_res)
        return
    print('Login OK for', login_res.get('username'))

    start = (date.today() + timedelta(days=7)).isoformat()
    end = (date.today() + timedelta(days=8)).isoformat()
    payload = {
        'from': start,
        'to': end,
        'type': 'Earned Leave',
        'note': 'E2E test leave',
        'notify': [] ,
        'username': TEST_USERNAME
    }
    print('Creating leave...', payload)
    res = api_create_leave(session, payload)
    print('Create response:', res)
    if not res.get('success'):
        print('Failed to create leave on API')
        return

    # connect to DB
    print('Checking DB for inserted leave...')
    conn = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    rows = query_db_for_leave(conn, TEST_USERNAME, start)
    conn.close()
    if rows:
        print('Found leave row(s):')
        for r in rows:
            print(r)
    else:
        print('No matching leave rows found in DB.')

if __name__ == '__main__':
    main()
