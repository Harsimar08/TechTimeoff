# 🎉 Signup Feature & MySQL User Management Guide

## ✅ Signup Feature is Ready!

Yes, you can **create new users** using the signup page and then login with those credentials!

---

## 🚀 How to Use Signup

### 1. **Access the Signup Page**

From the login page, click on **"Don't have an account? Sign up"** link.

The link will redirect you to: `http://localhost:5173/signup`

### 2. **Fill in the Registration Form**

**Required Fields:**
- ✅ **Full Name** - Your complete name
- ✅ **Email** - Your email address (must be unique)
- ✅ **Password** - At least 6 characters
- ✅ **Confirm Password** - Must match password
- ✅ **Department** - Your department name
- ✅ **Role** - Select from: Faculty, Coordinator, Chief Coordinator, or Principal

**Optional Fields:**
- Employee ID
- Phone Number

### 3. **Select Your Role**

Choose the appropriate role card:
- **👨‍🏫 Faculty** - Teachers and professors
- **👔 Coordinator** - Department coordinators  
- **👨‍💼 Chief Coordinator** - Head of coordinators
- **🎓 Principal** - Institution head

### 4. **Submit Registration**

Click the **"Create Account"** button.

Upon successful registration:
- ✅ Account is created in the database
- ✅ JWT token is generated
- ✅ You're automatically logged in
- ✅ Redirected to your dashboard

---

## 📋 View Users in MySQL Workbench

### Method 1: Using MySQL Workbench GUI

#### Step 1: Open MySQL Workbench
```bash
# Launch MySQL Workbench application
```

#### Step 2: Connect to Database
1. Click on your local MySQL connection (usually **"Local instance 3306"**)
2. If prompted, enter your MySQL password (likely empty if you just installed)
3. Click **"Connect"**

#### Step 3: Select Database
In the left sidebar under **"SCHEMAS"**:
1. Find and click **"techtimeoff"** database
2. Expand it to see tables
3. You should see:
   - **users** ← This is where your users are!
   - **leaves** ← Leave requests

#### Step 4: View All Users
**Option A - Right-click Method:**
1. Right-click on **"users"** table
2. Select **"Select Rows - Limit 1000"**
3. You'll see all users in a nice table view!

**Option B - SQL Query:**
1. Click the **SQL icon** (⚡ lightning bolt) to open query tab
2. Type this query:
   ```sql
   SELECT * FROM users;
   ```
3. Click the **"Execute"** button (⚡ lightning bolt icon)
4. View results in the bottom panel

#### Step 5: View Specific Columns (Clean View)
For a cleaner view showing only important fields:
```sql
SELECT 
    id,
    name,
    email,
    role,
    department,
    employee_id,
    phone_number,
    is_active,
    created_at
FROM users
ORDER BY created_at DESC;
```

This shows newest users first!

---

### Method 2: Using Terminal/Command Line

#### Quick View - All Users
```bash
mysql -u root techtimeoff -e "SELECT * FROM users;"
```

#### Clean View - Formatted
```bash
mysql -u root techtimeoff -e "
SELECT 
    id,
    name,
    email,
    role,
    department,
    created_at
FROM users
ORDER BY created_at DESC;
"
```

#### Count Users
```bash
mysql -u root techtimeoff -e "SELECT COUNT(*) as total_users FROM users;"
```

#### View Only Faculty
```bash
mysql -u root techtimeoff -e "SELECT id, name, email, role FROM users WHERE role='faculty';"
```

#### Search by Email
```bash
mysql -u root techtimeoff -e "SELECT * FROM users WHERE email LIKE '%kritika%';"
```

---

## 🔍 Useful SQL Queries

### View All Users with Details
```sql
USE techtimeoff;

SELECT 
    id,
    name,
    email,
    role,
    department,
    employee_id as 'Employee ID',
    is_active as 'Active',
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as 'Created At'
FROM users
ORDER BY created_at DESC;
```

### Count Users by Role
```sql
SELECT 
    role,
    COUNT(*) as count
FROM users
GROUP BY role;
```

### Find Recently Created Users (Last 24 hours)
```sql
SELECT 
    name,
    email,
    role,
    created_at
FROM users
WHERE created_at >= NOW() - INTERVAL 1 DAY
ORDER BY created_at DESC;
```

### Find User by Email
```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

### Check if Email Already Exists
```sql
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Email already exists'
        ELSE 'Email available'
    END as result
FROM users 
WHERE email = 'test@example.com';
```

---

## 🧪 Testing the Signup Flow

### Test Case 1: Create a New User

1. **Go to Signup Page:**
   ```
   http://localhost:5173/signup
   ```

2. **Fill in the form:**
   ```
   Name: Test User
   Email: testuser@jims.edu
   Password: password123
   Confirm Password: password123
   Department: Computer Science
   Role: Faculty
   ```

3. **Click "Create Account"**

4. **Verify in MySQL:**
   ```sql
   SELECT * FROM users WHERE email = 'testuser@jims.edu';
   ```

### Test Case 2: Try Duplicate Email

1. Try to signup with same email again
2. Should get error: **"User with this email already exists"**

### Test Case 3: Login with New Account

1. **Logout** (if logged in)
2. **Go to Login page**
3. **Login with:**
   ```
   Email: testuser@jims.edu
   Password: password123
   Role: Faculty
   ```
4. **Should successfully login!** ✅

---

## 🎯 Quick Reference

### Sample Test Users Already in Database

| Email | Password | Role |
|-------|----------|------|
| kritika@jims.edu | password123 | faculty |
| rajesh@jims.edu | password123 | coordinator |
| sunita@jims.edu | password123 | chief_coordinator |
| amit@jims.edu | password123 | principal |

### Database Locations

**Tables:**
- `users` - All user accounts
- `leaves` - All leave requests

**Connection Info:**
- Host: `localhost`
- Port: `3306`
- Database: `techtimeoff`
- User: `root`
- Password: *(empty/blank)*

---

## 🐛 Troubleshooting

### "Email already exists" Error
**Cause:** Someone already registered with that email.

**Solution:** 
- Use a different email, OR
- Delete the existing user:
  ```sql
  DELETE FROM users WHERE email = 'duplicate@email.com';
  ```

### Can't Connect to MySQL Workbench
**Check MySQL is running:**
```bash
brew services list  # macOS
# Look for mysql - should say "started"
```

**Start MySQL if stopped:**
```bash
brew services start mysql  # macOS
```

### Users Not Showing in Workbench
**Refresh the schemas:**
1. In MySQL Workbench, right-click on **"techtimeoff"** in SCHEMAS
2. Select **"Refresh All"**

---

## 📊 Export Users to CSV

### From MySQL Workbench:
1. Run your query to show users
2. In the result grid, click **"Export"** icon
3. Choose **CSV format**
4. Save the file

### From Terminal:
```bash
mysql -u root techtimeoff -e "SELECT * FROM users;" > users_export.csv
```

---

## 🎉 Summary

✅ **Signup feature works!**
- Users can self-register
- Email must be unique
- Password is securely hashed
- JWT token generated on signup
- Auto-login after registration

✅ **View users easily!**
- MySQL Workbench - GUI interface
- Terminal - Quick commands
- SQL queries - Flexible searching

✅ **Navigation works!**
- Login → Signup (click "Sign up" link)
- Signup → Login (click "Sign in" link)

---

**Happy user management! 🎊**

Got questions? Check the error logs:
- **Backend:** Terminal where Flask is running
- **Frontend:** Browser console (F12)
