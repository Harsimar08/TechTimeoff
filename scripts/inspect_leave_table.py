import mysql.connector

DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD='Aditya@123'
DB_NAME='user_auth'

try:
    conn = mysql.connector.connect(host=DB_HOST,user=DB_USER,password=DB_PASSWORD,database=DB_NAME)
    cur = conn.cursor()
    cur.execute("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='leave_requests'", (DB_NAME,))
    cols = cur.fetchall()
    print('leave_requests columns:')
    for c in cols:
        print(' ', c)
    print('\nSample rows (SELECT * LIMIT 5):')
    try:
        cur.execute('SELECT * FROM leave_requests LIMIT 5')
        rows = cur.fetchall()
        for r in rows:
            print(r)
    except Exception as e:
        print('Could not SELECT from leave_requests:', e)
    cur.close()
    conn.close()
except Exception as e:
    print('ERROR', e)
