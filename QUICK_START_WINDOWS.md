# 🚀 Quick Start Guide for Windows

## For Your Teammate: Complete Setup in 30 Minutes

Hey! 👋 This guide will help you set up the TechTimeOff backend on your Windows machine from scratch.

---

## 📦 What You'll Install

1. **Python** - Programming language (5 min)
2. **MySQL** - Database (10 min)
3. **Git** - Version control (3 min)
4. **Project Setup** - Clone & configure (10 min)

**Total Time:** ~30 minutes

---

## ⚡ Step 1: Install Python (5 minutes)

1. **Download:**
   - Go to: https://www.python.org/downloads/
   - Click the big yellow **"Download Python 3.12.x"** button

2. **Install:**
   - Run the downloaded file
   - ✅ **CHECK "Add Python to PATH"** ← VERY IMPORTANT!
   - Click **"Install Now"**
   - Wait for completion
   - Click **"Close"**

3. **Verify:**
   - Press `Windows + R`
   - Type: `cmd` and press Enter
   - Type: `python --version`
   - You should see: `Python 3.12.x`

✅ **Done!** Python is installed.

---

## ⚡ Step 2: Install MySQL (10 minutes)

1. **Download:**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Click **"Download"** for Windows MSI Installer
   - Click **"No thanks, just start my download"**

2. **Install:**
   - Run the downloaded file
   - Choose: **"Developer Default"**
   - Click **"Next"** → **"Execute"**
   - Wait for downloads (~5 minutes)
   - Click **"Next"** → **"Next"**

3. **Configure MySQL Server:**
   
   **Page 1 - Type and Networking:**
   - Keep defaults
   - Click **"Next"**
   
   **Page 2 - Authentication:**
   - Keep "Strong Password Encryption"
   - Click **"Next"**
   
   **Page 3 - Set Root Password:**
   - Enter a password (e.g., `MySecurePass123`)
   - **WRITE IT DOWN!** You'll need this later
   - Click **"Next"**
   
   **Page 4 - Windows Service:**
   - Keep defaults (Start MySQL at startup)
   - Click **"Next"**
   
   **Page 5 - Apply Configuration:**
   - Click **"Execute"**
   - Wait for green checkmarks
   - Click **"Finish"**
   
   **Final:**
   - Click **"Next"** → **"Finish"**

4. **Verify:**
   - MySQL Workbench should open automatically
   - If not, search for "MySQL Workbench" in Start menu
   - Click on **"Local instance MySQL80"**
   - Enter your root password
   - You should see the MySQL interface

✅ **Done!** MySQL is installed and running.

---

## ⚡ Step 3: Install Git (3 minutes)

1. **Download:**
   - Go to: https://git-scm.com/download/win
   - Download will start automatically

2. **Install:**
   - Run the downloaded file
   - Keep clicking **"Next"** with default settings
   - Click **"Install"**
   - Click **"Finish"**

3. **Verify:**
   - Open Command Prompt (`Windows + R` → type `cmd`)
   - Type: `git --version`
   - You should see: `git version 2.x.x`

✅ **Done!** Git is installed.

---

## ⚡ Step 4: Create Database (2 minutes)

1. **Open MySQL Workbench**
   - Click **"Local instance MySQL80"**
   - Enter your root password

2. **Create Database:**
   - In the query window (white area), type:
     ```sql
     CREATE DATABASE techtimeoff;
     ```
   - Click the **lightning bolt ⚡** icon (or press Ctrl+Enter)
   - You should see: "1 row(s) affected"

3. **Verify:**
   - Look at the left panel under "Schemas"
   - You should see **"techtimeoff"** database

✅ **Done!** Database is ready.

---

## ⚡ Step 5: Get the Code (5 minutes)

1. **Open Command Prompt:**
   - Press `Windows + R`
   - Type: `cmd` and press Enter

2. **Navigate to Documents:**
   ```cmd
   cd C:\Users\%USERNAME%\Documents
   ```

3. **Clone Repository:**
   ```cmd
   git clone https://github.com/Harsimar08/TechTimeoff.git
   ```
   Wait for download to complete.

4. **Enter Project:**
   ```cmd
   cd TechTimeOff
   git checkout kritikay
   cd backend_flask
   ```

✅ **Done!** Code is downloaded.

---

## ⚡ Step 6: Run Setup Script (5 minutes)

1. **Make sure you're in the backend_flask folder:**
   ```cmd
   dir
   ```
   You should see files like `app.py`, `setup.bat`, etc.

2. **Run Setup:**
   ```cmd
   setup.bat
   ```

3. **Follow the prompts:**
   - It will create a virtual environment
   - Install all dependencies
   - Create a `.env` file
   - When asked to edit `.env`, type: **`y`**

4. **Edit `.env` file in Notepad:**
   - Find this line:
     ```
     DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/techtimeoff
     ```
   - Replace `YOUR_PASSWORD` with your MySQL root password
   - Example:
     ```
     DATABASE_URL=mysql+pymysql://root:MySecurePass123@localhost:3306/techtimeoff
     ```
   - Save and close (Ctrl+S, Alt+F4)

5. **Press Enter to continue**

6. **When asked about seeding data, type: `y`**
   - This creates sample users for testing

✅ **Done!** Backend is configured.

---

## ⚡ Step 7: Start the Server (1 minute)

1. **Activate Virtual Environment:**
   ```cmd
   venv\Scripts\activate
   ```
   You should see `(venv)` at the start of your prompt.

2. **Start Server:**
   ```cmd
   python app.py
   ```

3. **You should see:**
   ```
   * Running on http://127.0.0.1:5000
   ```

4. **Test it:**
   - Open browser
   - Go to: http://localhost:5000/api/health
   - You should see:
     ```json
     {"status": "healthy", "message": "TechTimeOff API is running"}
     ```

✅ **Success!** 🎉 Your backend is running!

---

## 🧪 Test with Sample User

1. **Keep the server running** (don't close Command Prompt)

2. **Open a NEW Command Prompt**

3. **Test login:**
   ```cmd
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"kritika@jims.edu\",\"password\":\"password123\",\"role\":\"faculty\"}"
   ```

4. **You should get a response with a token!**

---

## 📝 Daily Usage

**Every time you want to start the server:**

```cmd
cd C:\Users\%USERNAME%\Documents\TechTimeoff\backend_flask
venv\Scripts\activate
python app.py
```

**To stop the server:**
- Press `Ctrl + C` in the terminal

---

## 🔑 Sample Login Credentials

After running `setup.bat` with seed data, you can use:

| Email | Password | Role |
|-------|----------|------|
| kritika@jims.edu | password123 | faculty |
| rajesh@jims.edu | password123 | coordinator |
| sunita@jims.edu | password123 | chief_coordinator |
| amit@jims.edu | password123 | principal |

---

## ❓ Common Issues

### "Python is not recognized"
**Fix:** Reinstall Python and CHECK the "Add Python to PATH" box!

### "MySQL connection failed"
**Fix:**
1. Make sure MySQL service is running:
   ```cmd
   net start MySQL80
   ```
2. Check your password in `.env` is correct

### "Port 5000 already in use"
**Fix:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <number> /F
```
Replace `<number>` with the PID from the first command.

### Can't activate virtual environment
**Fix:** Make sure you're in the `backend_flask` folder:
```cmd
cd backend_flask
venv\Scripts\activate
```

---

## 📞 Need Help?

1. **Check full guide:** See `WINDOWS_SETUP_GUIDE.md` for detailed troubleshooting
2. **Check MySQL:** Open MySQL Workbench and verify you can connect
3. **Check files:** Make sure `.env` file has correct password
4. **Ask team:** Send screenshot of error to team chat

---

## ✅ Checklist

Before calling it done, verify:

- [ ] Python installed (check: `python --version`)
- [ ] MySQL installed and running (check: open MySQL Workbench)
- [ ] Database created (check: see "techtimeoff" in MySQL Workbench)
- [ ] Code cloned (check: folder exists)
- [ ] Setup.bat completed successfully
- [ ] `.env` file has correct MySQL password
- [ ] Virtual environment activates
- [ ] Server starts without errors
- [ ] Health endpoint works (http://localhost:5000/api/health)
- [ ] Can login with sample user

---

## 🎉 You're Ready!

Your backend is now running! Tell your team lead and they'll help you set up the frontend.

**Server is running at:** http://localhost:5000/api

**Default test user:**
- Email: kritika@jims.edu
- Password: password123
- Role: faculty

---

**Setup Time:** ~30 minutes  
**Questions?** Check WINDOWS_SETUP_GUIDE.md or ask your team! 💪
