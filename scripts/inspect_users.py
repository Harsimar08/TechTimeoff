import mysql.connector

DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD='Aditya@123'
DB_NAME='user_auth'

try:
    conn = mysql.connector.connect(host=DB_HOST,user=DB_USER,password=DB_PASSWORD,database=DB_NAME)
    cur = conn.cursor()
    # If schema differs, list columns first then select available ones
    cur.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='users'", (DB_NAME,))
    cols = [r[0] for r in cur.fetchall()]
    print('users table columns:', cols)
    select_cols = [c for c in ['id','username','password','role','email','created_at'] if c in cols]
    if not select_cols:
        print('No known columns to select')
    else:
        q = 'SELECT ' + ','.join(select_cols) + ' FROM users'
        cur.execute(q)
        rows = cur.fetchall()
        if not rows:
            print('No users found')
        else:
            for r in rows:
                    print(r)
            # If FILTER_USER env var provided, show that specific row
            import os
            fu = os.environ.get('FILTER_USER')
            if fu:
                    cur.execute('SELECT * FROM users')
                    all_rows = cur.fetchall()
                    desc = [d[0] for d in cur.description]
                    print('SELECT * columns:', desc)
                    for ar in all_rows:
                        row_map = dict(zip(desc, ar))
                        print('row:', row_map)
                    cur.execute('SELECT * FROM users WHERE username=%s', (fu,))
                    print('filter', fu, cur.fetchall())
    cur.close()
    conn.close()
except Exception as e:
    print('ERROR', e)
