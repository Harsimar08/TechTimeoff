# 🚨 Error: Unknown column 'users.name' in 'field list'

## Quick Fix for Your Teammate

Your teammate is getting this error because the `user_auth` database has old/different tables. Here's the **FASTEST FIX**:

---

## ⚡ FASTEST FIX (2 Minutes)

### **Tell your teammate to do this:**

1. **Open Command Prompt** (in the project folder)

2. **Navigate to backend:**
   ```cmd
   cd backend_flask
   ```

3. **Activate virtual environment:**
   ```cmd
   venv\Scripts\activate
   ```

4. **Run the fix script:**
   
   **If using Command Prompt (cmd):**
   ```cmd
   fix_database.bat
   ```
   
   **If using PowerShell:**
   ```powershell
   .\fix_database.bat
   ```

5. **When asked to confirm, type:** `y`

6. **Wait for it to complete** (should see ✅ symbols)

7. **Start the server:**
   ```cmd
   python app.py
   ```

8. **Test the frontend again** - should work now! ✅

---

## 🔍 What Happened?

The `user_auth` database your teammate created has tables with a different structure:
- ❌ Old structure: Missing columns like `name`, `role`, `department`, etc.
- ✅ New structure: Has all required columns for the Flask app

---

## 🛠️ Manual Fix (If Script Doesn't Work)

### **Option 1: Create New Database (SAFEST)**

```cmd
REM 1. Open MySQL Workbench
REM 2. Run this SQL:
CREATE DATABASE techtimeoff;

REM 3. Edit .env file:
REM Change: DATABASE_URL=mysql+pymysql://root@localhost:3306/user_auth
REM To:     DATABASE_URL=mysql+pymysql://root@localhost:3306/techtimeoff

REM 4. Initialize:
cd backend_flask
venv\Scripts\activate
python init_db.py init
python init_db.py seed
python app.py
```

### **Option 2: Reset user_auth Database**

```cmd
cd backend_flask
venv\Scripts\activate
python init_db.py reset
python init_db.py seed
python app.py
```

---

## 📋 Step-by-Step for Teammate

### **If she's new to this, send her these exact steps:**

1. **Open MySQL Workbench**
   - Click "Local instance MySQL80"
   - Enter your MySQL password

2. **Delete old tables:**
   - In the query window, paste:
   ```sql
   DROP TABLE IF EXISTS user_auth.leaves;
   DROP TABLE IF EXISTS user_auth.users;
   ```
   - Click the lightning bolt ⚡ icon

3. **Open Command Prompt** (Windows key, type `cmd`)

4. **Go to project folder:**
   ```cmd
   cd C:\Users\YourUsername\path\to\TechTimeoff\backend_flask
   ```

5. **Activate environment:**
   ```cmd
   venv\Scripts\activate
   ```
   (You should see `(venv)` appear)

6. **Create tables:**
   ```cmd
   python init_db.py init
   ```
   Should see: ✅ Database tables created successfully!

7. **Add sample data:**
   ```cmd
   python init_db.py seed
   ```
   Should see: ✅ Database seeded successfully!

8. **Start server:**
   ```cmd
   python app.py
   ```
   Should see: Running on http://127.0.0.1:5000

9. **Test in browser:**
   - Go to http://localhost:5173 (your frontend)
   - Try signing up
   - Should work! ✅

---

## 🔑 Test Login After Fix

Use these credentials to test:
```
Email: kritika@jims.edu
Password: password123
Role: faculty
```

---

## ❓ If Still Getting Errors

### **Check these:**

1. **Is MySQL running?**
   ```cmd
   net start | findstr MySQL
   ```
   If not running:
   ```cmd
   net start MySQL80
   ```

2. **Is the password in .env correct?**
   - Open `backend_flask\.env`
   - Check: `DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/user_auth`
   - Replace `YOUR_PASSWORD` with actual MySQL root password

3. **Is virtual environment activated?**
   - Should see `(venv)` in command prompt
   - If not, run: `venv\Scripts\activate`

4. **Are you in the right folder?**
   ```cmd
   cd backend_flask
   dir
   ```
   Should see files like: app.py, init_db.py, requirements.txt

---

## 📸 What Success Looks Like

### **After running `python init_db.py init`:**
```
Connecting to database...
✅ Database connected successfully!
Creating tables...
✅ Database tables created successfully!
```

### **After running `python init_db.py seed`:**
```
✅ Seeded 4 users successfully!
✅ Seeded 8 leave requests successfully!
✅ Database seeded successfully!
```

### **After running `python app.py`:**
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

### **In browser at http://localhost:5000/api/health:**
```json
{
  "status": "healthy",
  "message": "TechTimeOff API is running"
}
```

---

## 📞 Still Need Help?

### **Send this info to your team:**

1. Screenshot of the error in Command Prompt
2. Contents of `.env` file (hide the password!)
3. Result of: `mysql --version`
4. Result of: `python --version`
5. Result of: `net start | findstr MySQL`

---

## ✅ Final Checklist

- [ ] MySQL server is running
- [ ] `user_auth` database exists (or `techtimeoff` if you created new one)
- [ ] `.env` has correct database name and password
- [ ] Virtual environment is activated
- [ ] Ran `python init_db.py init` successfully
- [ ] Ran `python init_db.py seed` successfully
- [ ] Flask server starts without errors
- [ ] Frontend can register/login

---

**This should fix the issue!** 🎉

The problem is simply that the database tables need to be recreated with the correct schema that matches the Flask app's models.
