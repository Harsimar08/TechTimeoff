# 🎯 COMPLETE SETUP - Start to Finish (Windows)

## For Your Teammate: Run These Commands in Order

This is the **complete, tested sequence** to get everything working.

---

## 📍 Step 1: Navigate to Project

**PowerShell:**
```powershell
cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask
```

**Command Prompt:**
```cmd
cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask
```

---

## 📍 Step 2: Create/Check Virtual Environment

```
python -m venv venv
```

(If it says "already exists", that's fine - continue)

---

## 📍 Step 3: Activate Virtual Environment

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Command Prompt:**
```cmd
venv\Scripts\activate
```

You should see `(venv)` at the start of your prompt.

---

## 📍 Step 4: Install All Dependencies

```
pip install -r requirements.txt
```

⏳ **Wait 1-2 minutes** for all packages to download and install.

You should see:
```
Successfully installed Flask-3.0.0 Flask-SQLAlchemy-3.1.1 ...
```

---

## 📍 Step 5: Verify .env File

Make sure `backend_flask\.env` exists and has correct MySQL password:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/user_auth
```

Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

---

## 📍 Step 6: Check MySQL is Running

```cmd
net start | findstr MySQL
```

Should see: `MySQL80` or similar.

If NOT running:
```cmd
net start MySQL80
```

---

## 📍 Step 7: Reset and Initialize Database

```
python init_db.py reset
```

Then:
```
python init_db.py init
```

Then:
```
python init_db.py seed
```

You should see:
```
✅ Database tables created successfully!
✅ Seeded 4 users successfully!
✅ Database seeded successfully!
```

---

## 📍 Step 8: Start Server

```
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

✅ **Backend is now running!**

---

## 📍 Step 9: Test It

**Open a NEW terminal** (keep the server running) and test:

**PowerShell:**
```powershell
curl -Method POST -Uri "http://localhost:5000/api/auth/login" -Headers @{"Content-Type"="application/json"} -Body '{"email":"kritika@jims.edu","password":"password123","role":"faculty"}'
```

**Command Prompt or Browser:**
Go to: http://localhost:5000/api/health

Should see:
```json
{"status": "healthy", "message": "TechTimeOff API is running"}
```

---

## 📍 Step 10: Test Frontend

1. Open your frontend (should be running on http://localhost:5173)
2. Try signing up with a new account
3. Try logging in with:
   - Email: `kritika@jims.edu`
   - Password: `password123`
   - Role: `faculty`

✅ **Should work now!**

---

## 📝 Complete Command Sequence (Copy-Paste All)

### **For PowerShell:**

```powershell
# Navigate to project
cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Make sure MySQL is running
net start MySQL80

# Reset database
python init_db.py reset

# Initialize tables
python init_db.py init

# Seed sample data
python init_db.py seed

# Start server
python app.py
```

### **For Command Prompt:**

```cmd
cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask
venv\Scripts\activate
pip install -r requirements.txt
net start MySQL80
python init_db.py reset
python init_db.py init
python init_db.py seed
python app.py
```

---

## ✅ Success Checklist

After running all steps, verify:

- [ ] Virtual environment activated (see `(venv)` in prompt)
- [ ] Flask installed (no "ModuleNotFoundError")
- [ ] MySQL running (no connection errors)
- [ ] Database tables created (no "Unknown column" errors)
- [ ] Sample users seeded (no "already exists" errors)
- [ ] Server running (see "Running on http://127.0.0.1:5000")
- [ ] Health endpoint works (http://localhost:5000/api/health)
- [ ] Frontend can register/login

---

## 🚨 Common Errors and Fixes

### "No module named 'flask'"
**Fix:** Run `pip install -r requirements.txt`

### "Unknown column 'users.name'"
**Fix:** Run `python init_db.py reset` then `python init_db.py init`

### "Can't connect to MySQL server"
**Fix:** Run `net start MySQL80`

### "Access denied for user 'root'"
**Fix:** Check password in `.env` file is correct

### "fix_database.bat not recognized" (PowerShell)
**Fix:** Use `.\fix_database.bat` instead

### "Virtual environment won't activate" (PowerShell)
**Fix:** Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 🎯 Daily Startup (After Initial Setup)

Every time you want to work on the project:

```powershell
cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask
.\venv\Scripts\Activate.ps1
python app.py
```

That's it! 🚀

---

## 📞 Still Having Issues?

Send screenshot of error + output of these commands:

```
python --version
mysql --version
pip list
```

---

**Following these steps in order should get everything working!** 💪
