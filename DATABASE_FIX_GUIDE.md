# 🔧 Database Schema Mismatch - Fix Guide

## ❌ The Problem

```
pymysql.err.OperationalError: (1054, "Unknown column 'users.name' in 'field list'")
```

**What happened:**
- Your `user_auth` database has existing tables
- Those tables have a different structure than what the Flask app expects
- The Flask app expects columns like `name`, `email`, `password_hash`, etc.
- The existing table has different columns

---

## ✅ Solution Options

### **Option 1: Create a New Database (RECOMMENDED)**

This is the safest option - keeps your old data intact.

#### Step 1: Create New Database

**Using MySQL Workbench:**
```sql
CREATE DATABASE techtimeoff;
```

**Using Command Line:**
```cmd
mysql -u root -p
CREATE DATABASE techtimeoff;
exit;
```

#### Step 2: Update `.env` file

Open `backend_flask/.env` and change:
```env
# Change FROM:
DATABASE_URL=mysql+pymysql://root@localhost:3306/user_auth

# Change TO:
DATABASE_URL=mysql+pymysql://root@localhost:3306/techtimeoff
```

#### Step 3: Initialize New Database

```cmd
cd backend_flask
python init_db.py init
python init_db.py seed
```

✅ **Done!** Your Flask app now uses the new `techtimeoff` database.

---

### **Option 2: Reset Existing Database (DESTROYS OLD DATA)**

⚠️ **WARNING:** This will delete ALL data in the `user_auth` database!

#### Step 1: Drop Existing Tables

**Using MySQL Workbench:**
1. Connect to local instance
2. Expand `user_auth` database
3. Right-click on each table → **"Drop Table"**
4. Click **"Drop Now"**

**OR using Command Line:**
```cmd
mysql -u root -p
USE user_auth;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS users;
exit;
```

#### Step 2: Reinitialize Database

```cmd
cd backend_flask
python init_db.py init
python init_db.py seed
```

---

### **Option 3: Use Automated Reset Command**

This is the quickest way if you don't care about existing data:

```cmd
cd backend_flask
python init_db.py reset
```

This will:
1. Drop all existing tables
2. Recreate tables with correct schema
3. You can then run: `python init_db.py seed`

---

## 🎯 Recommended Steps (Safest Approach)

### **For Your Teammate on Windows:**

1. **Open MySQL Workbench**
   - Connect to Local instance MySQL80
   - Enter root password

2. **Create New Database:**
   ```sql
   CREATE DATABASE techtimeoff;
   ```
   - Click the lightning bolt ⚡ to run
   - You should see: "1 row(s) affected"

3. **Update `.env` file:**
   - Open: `backend_flask\.env` in Notepad
   - Find line: `DATABASE_URL=mysql+pymysql://root@localhost:3306/user_auth`
   - Change to: `DATABASE_URL=mysql+pymysql://root@localhost:3306/techtimeoff`
   - Save and close (Ctrl+S, Alt+F4)

4. **Open Command Prompt:**
   ```cmd
   cd C:\Users\YourUsername\path\to\TechTimeoff\backend_flask
   venv\Scripts\activate
   ```

5. **Initialize Database:**
   ```cmd
   python init_db.py init
   ```
   
   You should see:
   ```
   ✅ Database tables created successfully!
   ```

6. **Seed Sample Data:**
   ```cmd
   python init_db.py seed
   ```
   
   You should see:
   ```
   ✅ Seeded 4 users successfully!
   ✅ Seeded 8 leave requests successfully!
   ✅ Database seeded successfully!
   ```

7. **Restart Flask Server:**
   ```cmd
   python app.py
   ```

8. **Test Registration:**
   - Open browser
   - Go to your frontend: http://localhost:5173
   - Try signing up with a new account
   - Should work now! ✅

---

## 🗄️ Verify Database Schema

After initialization, verify tables exist:

**Using MySQL Workbench:**
1. Right-click `techtimeoff` database → **"Refresh All"**
2. Expand `techtimeoff` → `Tables`
3. You should see:
   - ✅ `users` table
   - ✅ `leaves` table

**Check `users` table structure:**
```sql
DESCRIBE users;
```

You should see these columns:
```
+----------------+------------------+
| Field          | Type             |
+----------------+------------------+
| id             | int              |
| name           | varchar(100)     |
| email          | varchar(120)     |
| password_hash  | varchar(255)     |
| role           | enum(...)        |
| department     | varchar(100)     |
| employee_id    | varchar(50)      |
| phone_number   | varchar(20)      |
| profile_image  | varchar(255)     |
| google_id      | varchar(100)     |
| github_id      | varchar(100)     |
| is_active      | tinyint(1)       |
| created_at     | datetime         |
| updated_at     | datetime         |
+----------------+------------------+
```

---

## 🐛 Common Issues After Fix

### Still Getting 500 Error?

**Check Flask server terminal for error details:**
- Look for database connection errors
- Look for missing columns errors

### "Access Denied" Error?

**Solution:**
- Verify MySQL password in `.env` is correct
- Make sure MySQL server is running: `net start MySQL80`

### Tables Not Created?

**Solution:**
```cmd
# Check if you're in the right directory
cd backend_flask

# Make sure virtual environment is active
venv\Scripts\activate

# Try reset and reinit
python init_db.py reset
python init_db.py init
python init_db.py seed
```

---

## 📝 Quick Fix Commands (Copy-Paste)

### Create New Database and Initialize:
```cmd
REM Step 1: Create database in MySQL
mysql -u root -p -e "CREATE DATABASE techtimeoff;"

REM Step 2: Navigate to backend
cd backend_flask

REM Step 3: Activate virtual environment
venv\Scripts\activate

REM Step 4: Initialize tables
python init_db.py init

REM Step 5: Seed data
python init_db.py seed

REM Step 6: Start server
python app.py
```

### OR Reset Existing Database:
```cmd
cd backend_flask
venv\Scripts\activate
python init_db.py reset
python init_db.py seed
python app.py
```

---

## ✅ Verification Checklist

After applying the fix:

- [ ] New database `techtimeoff` exists (or old database reset)
- [ ] `.env` file points to correct database
- [ ] `python init_db.py init` runs without errors
- [ ] `python init_db.py seed` completes successfully
- [ ] Flask server starts without errors
- [ ] Can visit http://localhost:5000/api/health (shows "healthy")
- [ ] Frontend can register new users
- [ ] Frontend can login with seeded users
- [ ] No 500 errors in browser console

---

## 🎉 After Fix

**Test with sample user:**
- Email: `kritika@jims.edu`
- Password: `password123`
- Role: `faculty`

**Or create new user:**
- Go to Signup page
- Fill in details
- Should work without 500 error!

---

**Need More Help?**
- Check Flask server terminal for detailed errors
- Check MySQL Workbench to verify database and tables exist
- Share the full error message with your team

---

**Created:** November 2025  
**For:** Windows users with database schema mismatch
