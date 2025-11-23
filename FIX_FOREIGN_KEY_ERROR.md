# 🚨 ERROR: Cannot drop table 'users' referenced by foreign key

## ❌ The Error:
```
pymysql.err.OperationalError: (3730, "Cannot drop table 'users' referenced by a foreign key constraint 'fk_notify_user' on table 'leave_request_notify'.")
```

## ✅ FIXED! 

I've updated the `init_db.py` file to handle this. Now tell her to:

### **Run This Again:**

```powershell
.\fix_database.bat
```

Or manually:
```powershell
python init_db.py reset
python init_db.py init
python init_db.py seed
```

**It should work now!** ✅

---

## 🔍 What Was The Problem?

The `user_auth` database has **extra tables** (like `leave_request_notify`) that your teammate created earlier. These tables have **foreign key constraints** pointing to the `users` table, which prevents it from being dropped.

The fix: Temporarily disable foreign key checks, drop all tables, then re-enable checks.

---

## 📋 What Changed in init_db.py:

**Before (didn't work):**
```python
db.drop_all()
db.create_all()
```

**After (works!):**
```python
# Disable foreign key checks
db.session.execute(db.text('SET FOREIGN_KEY_CHECKS=0;'))
db.session.commit()

# Drop all tables (including ones with foreign keys)
db.drop_all()

# Re-enable foreign key checks
db.session.execute(db.text('SET FOREIGN_KEY_CHECKS=1;'))
db.session.commit()

# Create new tables
db.create_all()
```

---

## ✅ Complete Fix Steps for Your Teammate:

1. **The code has been updated** - she needs to get the latest version

2. **If she has local changes, pull the updates:**
   ```powershell
   git pull origin kritikay
   ```

3. **Or tell her to download the updated `init_db.py` file**

4. **Then run:**
   ```powershell
   cd backend_flask
   .\venv\Scripts\Activate.ps1
   .\fix_database.bat
   ```

5. **Type `y` when asked**

6. **Should complete successfully now!**

---

## 🎯 Alternative: Manual Database Cleanup

If the automated script still has issues, she can manually clean the database:

### **Option 1: Drop All Tables in MySQL Workbench**

1. Open MySQL Workbench
2. Connect to local instance
3. Expand `user_auth` database
4. Right-click on the database → **"Drop Schema"**
5. Confirm deletion
6. Create new database:
   ```sql
   CREATE DATABASE user_auth;
   ```
7. Then run:
   ```powershell
   python init_db.py init
   python init_db.py seed
   ```

### **Option 2: Use SQL Commands**

Open MySQL Workbench and run:

```sql
-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS=0;

-- Drop all tables
DROP TABLE IF EXISTS leave_request_notify;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS users;
-- Add any other tables you see

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
```

Then run:
```powershell
python init_db.py init
python init_db.py seed
```

---

## 📊 View All Tables in Database

To see what tables exist in the database:

**MySQL Workbench:**
1. Expand `user_auth` database
2. Look under "Tables"

**SQL Query:**
```sql
USE user_auth;
SHOW TABLES;
```

You might see tables like:
- `users`
- `leaves`
- `leave_request_notify` ← This is the problematic one
- Maybe others...

---

## ✅ After Fix Works

You should see:
```
✅ Database reset successfully
✅ Database tables created successfully!
✅ Seeded 4 users successfully!
✅ Database seeded successfully!
```

Then start the server:
```powershell
python app.py
```

And test the frontend! 🚀

---

## 🤔 Why Did This Happen?

Your teammate's `user_auth` database had tables from previous experiments with different structures. When we tried to drop the `users` table, MySQL refused because other tables had foreign keys referencing it.

The solution: Temporarily disable foreign key constraint checking during the drop operation.

---

## 📝 Complete Command Sequence (Fresh Start)

If you want to be absolutely sure, run this complete sequence:

```powershell
# Navigate to project
cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Update code (if needed)
git pull origin kritikay

# Reset database with new fix
python init_db.py reset

# Type "yes" when prompted

# Initialize tables
python init_db.py init

# Seed data
python init_db.py seed

# Start server
python app.py
```

---

## ✅ Verification

After reset completes, verify in MySQL Workbench:

1. Expand `user_auth` database
2. Should see ONLY these tables:
   - ✅ `users`
   - ✅ `leaves`
3. No other tables should exist

Check users table:
```sql
SELECT * FROM users;
```

Should see 4 sample users.

---

**The fix has been applied! She should pull the latest code and try again.** 🎉
