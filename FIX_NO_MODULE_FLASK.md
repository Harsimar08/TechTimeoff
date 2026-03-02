# 🚨 ERROR: No module named 'flask'

## ❌ What This Means:
Your virtual environment doesn't have Flask and other required packages installed.

---

## ✅ SOLUTION (Copy-Paste These Commands):

### **If Using PowerShell:**
```powershell
cd backend_flask
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\fix_database.bat
```

### **If Using Command Prompt (cmd):**
```cmd
cd backend_flask
venv\Scripts\activate
pip install -r requirements.txt
fix_database.bat
```

---

## ⏱️ What to Expect:

1. **After running `pip install -r requirements.txt`:**
   - You'll see packages being downloaded
   - Takes about 1-2 minutes
   - You'll see: `Successfully installed Flask-3.0.0 ...`

2. **After running the fix script:**
   - Should now work without Flask errors!
   - You'll see the database reset process

---

## 📋 Detailed Steps:

1. **Open PowerShell or Command Prompt**

2. **Go to backend folder:**
   ```powershell
   cd C:\Users\Ej327ws\OneDrive\Desktop\project\TechTimeoff\backend_flask
   ```

3. **Activate virtual environment:**
   
   **PowerShell:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   **Command Prompt:**
   ```cmd
   venv\Scripts\activate
   ```

4. **Install all packages:**
   ```
   pip install -r requirements.txt
   ```
   
   ⏳ **Wait for this to complete!** You should see something like:
   ```
   Collecting Flask==3.0.0
   Downloading Flask-3.0.0-py3-none-any.whl
   ...
   Successfully installed Flask-3.0.0 Flask-Bcrypt-1.0.1 ...
   ```

5. **Now run the fix script:**
   
   **PowerShell:**
   ```powershell
   .\fix_database.bat
   ```
   
   **Command Prompt:**
   ```cmd
   fix_database.bat
   ```

6. **Type `y` when asked**

7. **Done!** ✅

---

## 🤔 Why Did This Happen?

When you created the virtual environment with `python -m venv venv`, it created an empty environment. You need to install all the required packages using `pip install -r requirements.txt`.

The `requirements.txt` file lists all needed packages:
- Flask (web framework)
- Flask-SQLAlchemy (database)
- Flask-Bcrypt (passwords)
- Flask-JWT-Extended (authentication)
- PyMySQL (MySQL connection)
- And more...

---

## ✅ Verify Installation:

After installing, you can check if Flask is installed:

```powershell
python -c "import flask; print(flask.__version__)"
```

Should output: `3.0.0` ✅

---

## 🎯 Alternative: Run Setup Script First

Instead of manually installing, you could have run:

**PowerShell:**
```powershell
.\setup.bat
```

**Command Prompt:**
```cmd
setup.bat
```

This script does everything automatically:
- Creates virtual environment
- Installs all dependencies
- Creates .env file
- Initializes database
- Seeds sample data

---

## 📞 Still Getting Errors?

### If `pip install` fails:

1. **Update pip first:**
   ```
   python -m pip install --upgrade pip
   ```

2. **Try installing again:**
   ```
   pip install -r requirements.txt
   ```

### If virtual environment won't activate:

**PowerShell execution policy error?**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

---

## ✅ After This Fix Works:

You should see:
```
✅ Virtual environment activated
✅ Dependencies already installed
✅ Database reset complete
✅ Database tables created
✅ Sample data added
🎉 Database Fixed Successfully!
```

Then you can start the server:
```
python app.py
```

And test your frontend! 🚀

---

**Bottom line:** You just need to install the packages! Run `pip install -r requirements.txt` and you're good to go. 💪
