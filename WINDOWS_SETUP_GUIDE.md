# 🪟 Windows Setup Guide - TechTimeOff Backend

## 📋 Complete Setup Guide for Windows Users

This guide will help you set up the TechTimeOff Flask backend on Windows from scratch.

---

## ✅ Prerequisites Checklist

Before starting, you'll need:
- [ ] Windows 10/11
- [ ] Administrator access
- [ ] Internet connection
- [ ] Git installed
- [ ] Python 3.8 or higher

---

## 🚀 Step-by-Step Setup

### **Step 1: Install Python**

1. **Download Python:**
   - Go to: https://www.python.org/downloads/
   - Download Python 3.11 or 3.12 (recommended)

2. **Install Python:**
   - ✅ **IMPORTANT:** Check **"Add Python to PATH"** during installation
   - Click "Install Now"
   - Wait for installation to complete

3. **Verify Installation:**
   ```cmd
   python --version
   pip --version
   ```
   You should see version numbers for both.

---

### **Step 2: Install MySQL**

#### Option A: MySQL Installer (Recommended)

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Choose **"Windows (x86, 32-bit), MSI Installer"** (works on 64-bit too)
   - Click **"Download"** (you can skip login)

2. **Run MySQL Installer:**
   - Choose **"Developer Default"** or **"Server only"**
   - Click **"Next"** → **"Execute"** to download components
   - Wait for all downloads to complete

3. **Configure MySQL Server:**
   
   **Type and Networking:**
   - Development Computer
   - Port: **3306** (default)
   - ✅ Check "Open Windows Firewall ports"
   
   **Authentication Method:**
   - Choose **"Use Strong Password Encryption"** (recommended)
   
   **Accounts and Roles:**
   - Set **Root Password** (REMEMBER THIS!)
     - Example: `MySecurePass123!`
   - (Optional) Add a MySQL user account for your project
   
   **Windows Service:**
   - ✅ Configure MySQL Server as Windows Service
   - ✅ Start the MySQL Server at System Startup
   - Service Name: **MySQL80** (default)
   
   **Apply Configuration:**
   - Click **"Execute"** → Wait for completion
   - Click **"Finish"**

4. **Install MySQL Workbench (Optional but Recommended):**
   - During MySQL installation, select **MySQL Workbench**
   - Or download separately: https://dev.mysql.com/downloads/workbench/

5. **Verify MySQL is Running:**
   ```cmd
   # Open Command Prompt
   mysql --version
   ```
   
   If command not found, add MySQL to PATH:
   - Add this to System Environment Variables:
     ```
     C:\Program Files\MySQL\MySQL Server 8.0\bin
     ```

#### Option B: XAMPP (Easier but larger)

1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/
   - Download for Windows

2. **Install XAMPP:**
   - Run installer → Choose installation directory
   - Select **MySQL** component
   - Complete installation

3. **Start MySQL:**
   - Open **XAMPP Control Panel**
   - Click **"Start"** next to MySQL
   - MySQL runs on port **3306**

---

### **Step 3: Set Up MySQL Database**

#### Using MySQL Workbench:

1. **Open MySQL Workbench**
2. **Connect to Local MySQL:**
   - Click on **"Local instance MySQL80"**
   - Enter your root password
   - Click **"OK"**

3. **Create Database:**
   ```sql
   CREATE DATABASE techtimeoff;
   ```
   
4. **Create User (Optional but Recommended):**
   ```sql
   CREATE USER 'techtimeoff_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON techtimeoff.* TO 'techtimeoff_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### Using Command Line:

1. **Open Command Prompt as Administrator**

2. **Login to MySQL:**
   ```cmd
   mysql -u root -p
   ```
   Enter your root password when prompted.

3. **Create Database:**
   ```sql
   CREATE DATABASE techtimeoff;
   exit;
   ```

---

### **Step 4: Clone the Repository**

1. **Install Git (if not already installed):**
   - Download from: https://git-scm.com/download/win
   - Install with default settings

2. **Clone the Repository:**
   ```cmd
   cd C:\Users\YourUsername\Documents
   git clone https://github.com/Harsimar08/TechTimeoff.git
   cd TechTimeoff
   ```

3. **Switch to kritikay branch:**
   ```cmd
   git checkout kritikay
   ```

---

### **Step 5: Set Up Backend Environment**

1. **Navigate to Backend Folder:**
   ```cmd
   cd backend_flask
   ```

2. **Create Virtual Environment:**
   ```cmd
   python -m venv venv
   ```

3. **Activate Virtual Environment:**
   ```cmd
   venv\Scripts\activate
   ```
   
   You should see `(venv)` at the beginning of your command prompt.

4. **Install Dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```
   
   Wait for all packages to install (takes 1-2 minutes).

---

### **Step 6: Configure Environment Variables**

1. **Create `.env` file:**
   ```cmd
   copy .env.example .env
   ```
   
   Or manually create a file named `.env` in the `backend_flask` folder.

2. **Edit `.env` file** (use Notepad or VS Code):
   ```env
   # Database Configuration
   DATABASE_URL=mysql+pymysql://root:YourRootPassword@localhost:3306/techtimeoff
   
   # If you created a separate user:
   # DATABASE_URL=mysql+pymysql://techtimeoff_user:your_password@localhost:3306/techtimeoff
   
   # Secret Keys (generate random strings)
   SECRET_KEY=your-very-long-random-secret-key-here-min-32-chars
   JWT_SECRET=another-very-long-random-secret-key-for-jwt-min-32-chars
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Server Port
   PORT=5000
   
   # Environment
   FLASK_ENV=development
   ```

3. **Important Notes:**
   - Replace `YourRootPassword` with your actual MySQL root password
   - Keep the `:3306` (default MySQL port)
   - Keep `/techtimeoff` (database name)
   - Generate strong random strings for SECRET_KEY and JWT_SECRET

4. **Generate Random Secret Keys (Optional but Recommended):**
   ```cmd
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
   Run this twice to generate two different keys for SECRET_KEY and JWT_SECRET.

---

### **Step 7: Initialize Database**

1. **Make sure you're in `backend_flask` folder and virtual environment is active:**
   ```cmd
   # Should see (venv) in prompt
   ```

2. **Initialize Database Tables:**
   ```cmd
   python init_db.py init
   ```
   
   You should see:
   ```
   ✅ Database tables created successfully!
   ```

3. **Seed Sample Data (Optional but Recommended for Testing):**
   ```cmd
   python init_db.py seed
   ```
   
   This creates 4 sample users:
   - Faculty: kritika@jims.edu / password123
   - Coordinator: rajesh@jims.edu / password123
   - Chief Coordinator: sunita@jims.edu / password123
   - Principal: amit@jims.edu / password123

---

### **Step 8: Start the Backend Server**

1. **Start Flask Server:**
   ```cmd
   python app.py
   ```

2. **You should see:**
   ```
   * Running on http://127.0.0.1:5000
   * Running on http://192.168.x.x:5000
   ```

3. **Test the Server:**
   Open browser and go to:
   ```
   http://localhost:5000/api/health
   ```
   
   You should see:
   ```json
   {
     "status": "healthy",
     "message": "TechTimeOff API is running"
   }
   ```

---

### **Step 9: Verify Setup**

#### Test API Endpoints:

1. **Test Registration:**
   ```cmd
   curl -X POST http://localhost:5000/api/auth/register ^
     -H "Content-Type: application/json" ^
     -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"faculty\",\"department\":\"IT\"}"
   ```

2. **Test Login:**
   ```cmd
   curl -X POST http://localhost:5000/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"faculty\"}"
   ```

**Note:** If `curl` is not available on Windows, use:
- **PowerShell** (use `Invoke-WebRequest`)
- **Postman** (download from https://www.postman.com/downloads/)
- **Browser** (for GET requests)

---

## 🔧 Troubleshooting

### **MySQL Connection Errors**

#### Error: "Can't connect to MySQL server"
**Solution:**
1. Check if MySQL service is running:
   ```cmd
   # Open Services (Windows + R → services.msc)
   # Look for "MySQL80" → Right-click → Start
   ```
   
   Or from Command Prompt:
   ```cmd
   net start MySQL80
   ```

2. Verify MySQL is listening on port 3306:
   ```cmd
   netstat -an | findstr :3306
   ```

#### Error: "Access denied for user"
**Solution:**
- Double-check username and password in `.env`
- Make sure password doesn't contain special characters that need escaping
- Try connecting via MySQL Workbench to verify credentials

#### Error: "Unknown database 'techtimeoff'"
**Solution:**
```sql
-- Open MySQL Workbench and run:
CREATE DATABASE techtimeoff;
```

---

### **Python/pip Errors**

#### Error: "'python' is not recognized"
**Solution:**
1. Reinstall Python and check "Add Python to PATH"
2. Or manually add to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" under System Variables
   - Add: `C:\Users\YourUsername\AppData\Local\Programs\Python\Python311`
   - Add: `C:\Users\YourUsername\AppData\Local\Programs\Python\Python311\Scripts`

#### Error: "pip install fails"
**Solution:**
1. Upgrade pip:
   ```cmd
   python -m pip install --upgrade pip
   ```

2. If still fails, try:
   ```cmd
   pip install --user -r requirements.txt
   ```

---

### **Port Already in Use**

#### Error: "Address already in use"
**Solution:**
1. Find process using port 5000:
   ```cmd
   netstat -ano | findstr :5000
   ```
   
2. Kill the process:
   ```cmd
   taskkill /PID <process_id> /F
   ```
   
   Replace `<process_id>` with the number from netstat output.

3. Or change port in `.env`:
   ```env
   PORT=5001
   ```

---

### **Virtual Environment Issues**

#### Error: "venv\Scripts\activate is not recognized"
**Solution:**
Make sure you're in the `backend_flask` folder:
```cmd
cd backend_flask
venv\Scripts\activate
```

#### Error: "Execution policies" (PowerShell)
**Solution:**
If using PowerShell instead of Command Prompt:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1
```

---

## 📝 Quick Reference Commands

### Daily Startup:
```cmd
# 1. Navigate to project
cd C:\path\to\TechTimeoff\backend_flask

# 2. Activate virtual environment
venv\Scripts\activate

# 3. Start server
python app.py
```

### Database Management:
```cmd
# Reset database (WARNING: Deletes all data)
python init_db.py reset

# Reinitialize tables
python init_db.py init

# Re-seed sample data
python init_db.py seed
```

### Check MySQL Status:
```cmd
# Check if MySQL is running
net start | findstr MySQL

# Start MySQL
net start MySQL80

# Stop MySQL
net stop MySQL80
```

---

## 🗄️ Using MySQL Workbench

### View Data:
1. Open MySQL Workbench
2. Connect to local instance
3. Expand "techtimeoff" database
4. Right-click table → "Select Rows - Limit 1000"

### Run Queries:
```sql
-- View all users
SELECT * FROM users;

-- View all leaves
SELECT * FROM leaves;

-- View user with leaves
SELECT u.name, u.email, l.leave_type, l.status
FROM users u
LEFT JOIN leaves l ON u.id = l.user_id;
```

---

## 📦 What Gets Installed

### Python Packages (from requirements.txt):
- **Flask** 3.0.0 - Web framework
- **Flask-SQLAlchemy** 3.1.1 - Database ORM
- **Flask-Bcrypt** 1.0.1 - Password hashing
- **Flask-JWT-Extended** 4.6.0 - JWT authentication
- **Flask-CORS** 4.0.0 - CORS support
- **PyMySQL** 1.1.0 - MySQL connector
- **python-dotenv** 1.0.0 - Environment variables

### Total Size:
- Virtual environment: ~200MB
- MySQL: ~500MB
- Total: ~700MB

---

## 🎯 Next Steps After Setup

1. ✅ **Test the API** using Postman or curl
2. ✅ **Set up Frontend** (separate guide)
3. ✅ **Update frontend API URL** to `http://localhost:5000/api`
4. ✅ **Test login/signup flow**
5. ✅ **Create leave requests**
6. ✅ **View data in MySQL Workbench**

---

## 🆘 Need Help?

### Common Issues:
1. **MySQL won't start:** Check Windows Services
2. **Can't connect:** Verify `.env` credentials
3. **Port in use:** Change PORT in `.env` or kill process
4. **Import errors:** Reinstall dependencies in virtual environment
5. **Database errors:** Reset and reinitialize database

### Useful Links:
- **MySQL Documentation:** https://dev.mysql.com/doc/
- **Flask Documentation:** https://flask.palletsprojects.com/
- **Python Documentation:** https://docs.python.org/3/

### Check Logs:
- Flask server logs appear in the terminal
- MySQL logs: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`

---

## ✅ Setup Verification Checklist

Before starting development, verify:

- [ ] Python installed and in PATH
- [ ] MySQL installed and running
- [ ] Database `techtimeoff` created
- [ ] Repository cloned
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] `.env` file configured with correct credentials
- [ ] Database initialized (`python init_db.py init`)
- [ ] Sample data seeded (`python init_db.py seed`)
- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Can login with sample user

---

## 🎉 You're All Set!

Your Flask backend is now running on Windows! 🚀

**Default Credentials (after seeding):**
- Email: `kritika@jims.edu`
- Password: `password123`
- Role: `faculty`

**Server URL:** http://localhost:5000/api

---

**Questions or Issues?** Contact your team lead or check the main README.md file.

**Last Updated:** November 2025
