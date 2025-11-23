# 🚨 FIX: "fix_database.bat is not recognized"

## ❌ Error You're Getting:
```
The term 'fix_database.bat' is not recognized...
Suggestion: instead type: ".\fix_database.bat"
```

---

## ✅ SOLUTION (Copy-Paste This):

You're using **PowerShell**. Just add `.\` before the command:

```powershell
.\fix_database.bat
```

**That's it!** Press Enter and it will work. ✅

---

## 📋 Complete Step-by-Step for PowerShell Users:

1. **Make sure you're in the backend_flask folder:**
   ```powershell
   cd C:\Users\YourUsername\path\to\TechTimeoff\backend_flask
   ```

2. **Check you're in the right place:**
   ```powershell
   ls
   ```
   (Should see files like `app.py`, `fix_database.bat`, etc.)

3. **Run the fix script:**
   ```powershell
   .\fix_database.bat
   ```

4. **Type `y` when asked to confirm**

5. **Wait for completion** (you'll see ✅ checkmarks)

6. **Start the server:**
   ```powershell
   python app.py
   ```

---

## 🔄 Alternative: Use Command Prompt Instead

If you prefer, you can switch to Command Prompt where you don't need the `.\`:

1. **Close PowerShell**

2. **Open Command Prompt:**
   - Press `Windows + R`
   - Type: `cmd`
   - Press Enter

3. **Navigate to project:**
   ```cmd
   cd C:\Users\YourUsername\path\to\TechTimeoff\backend_flask
   ```

4. **Run fix script (no .\ needed):**
   ```cmd
   fix_database.bat
   ```

---

## 💡 Why This Happens

- **PowerShell** requires `.\` for security (to prevent accidentally running malicious scripts)
- **Command Prompt** runs `.bat` files directly

Both are fine to use - just remember:
- PowerShell: `.\fix_database.bat`
- Command Prompt: `fix_database.bat`

---

## ✅ After Running the Fix

You should see:
```
========================================
🎉 Database Fixed Successfully!
========================================

Sample users created:
  Email: kritika@jims.edu
  Password: password123
  Role: faculty
```

Then you can start the server and try the frontend again!

---

**Just remember: `.\` before .bat files in PowerShell!** 🎯
