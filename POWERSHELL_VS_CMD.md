# 🪟 PowerShell vs Command Prompt - Quick Guide

## ❓ Which Terminal Are You Using?

If you see `PS C:\...>` → You're using **PowerShell**  
If you see `C:\...>` → You're using **Command Prompt**

---

## ⚡ Running .bat Files

### **In PowerShell:**
```powershell
.\fix_database.bat
.\setup.bat
```
(Need the `.\` before the filename)

### **In Command Prompt (cmd):**
```cmd
fix_database.bat
setup.bat
```
(No `.\` needed)

---

## 🔧 How to Switch to Command Prompt

### **Method 1: Windows Run**
1. Press `Windows + R`
2. Type: `cmd`
3. Press Enter

### **Method 2: Start Menu**
1. Press Windows key
2. Type: `cmd`
3. Click "Command Prompt"

### **Method 3: From PowerShell**
Just type:
```powershell
cmd
```

---

## 📝 Common Commands Work the Same

These work in BOTH PowerShell and Command Prompt:
```
cd backend_flask
python app.py
python init_db.py init
venv\Scripts\activate
```

Only `.bat` and `.ps1` script execution is different!

---

## ✅ Recommendation for Your Project

**Use Command Prompt (cmd)** for this project because:
- ✅ All `.bat` scripts work directly
- ✅ Simpler syntax
- ✅ All guides use `cmd` examples

---

**Quick Fix if Using PowerShell:**
Just add `.\` before any `.bat` file:
```powershell
.\fix_database.bat    ← Add .\
.\setup.bat           ← Add .\
```
