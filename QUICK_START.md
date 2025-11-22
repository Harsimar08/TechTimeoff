# Quick Start Guide - Flask + React Integration

## 🎯 TL;DR - Get Running in 2 Minutes

### Terminal 1: Start Flask Backend
```powershell
cd 'c:\Users\Ej327ws\New folder (2)\TechTimeoff'
python app.py
```
✅ Backend running: http://localhost:5000

### Terminal 2: Start React Frontend  
```powershell
cd 'c:\Users\Ej327ws\New folder (2)\TechTimeoff'
npm run dev
```
✅ Frontend running: http://localhost:5174

## ✨ What's Fixed

| Issue | Solution |
|-------|----------|
| ❌ Frontend using MongoDB | ✅ Converted to Flask API |
| ❌ No auth endpoints | ✅ Added /api/auth/* endpoints |
| ❌ No environment config | ✅ Created .env files |
| ❌ Missing dependencies | ✅ Installed jwt, mysql-connector |
| ❌ MongoDB references | ✅ Updated AuthContext console logs |

## 🚦 Testing Your Integration

### 1. Test Backend is Running
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status": "ok"}`

### 2. Test User Registration
Open browser → http://localhost:5174 → Signup page → Create account

### 3. Check Database
```bash
mysql -u root -p user_auth
SELECT * FROM users;
```

### 4. Check Logs
- **Flask Terminal**: Will show API requests and database queries
- **Browser Console**: Will show `🔧 API URL: http://localhost:5000/api`

## 📝 Key Files Modified

1. **app.py** - Added auth endpoints
2. **requirements.txt** - Added dependencies
3. **src/contexts/AuthContext.jsx** - Fixed console message
4. **.env.production** & **.env.development** - Created
5. **src/utils/api-auth.js** - Already correct (no changes needed)

## 🔧 Troubleshooting

### Issue: "Cannot find module 'jwt'"
**Solution**: Run `pip install pyjwt`

### Issue: "Database connection failed"
**Solution**: Check MySQL credentials in app.py line ~20
```python
host='localhost',
user='root',
password='Aditya@123',  # Verify this matches your setup
database='user_auth'
```

### Issue: API calls return 401 Unauthorized
**Solution**: 
- Make sure you're logged in
- Check browser's Application → Storage → localStorage for 'token'
- Open DevTools → Network tab → check Authorization header

### Issue: CORS error in browser console
**Solution**: Confirm CORS origin in app.py includes your frontend URL
```python
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}})
```

## 📚 API Reference

### Authentication
```javascript
// Register
POST /api/auth/register
{ email, username, password, role }
→ { token, user }

// Login  
POST /api/auth/login
{ email, password }
→ { token, user }

// Get current user
GET /api/auth/me
Header: Authorization: Bearer <token>
→ { user }
```

### Leave Requests
```javascript
// Create leave
POST /api/leave
{ from, to, type, note, username, notifyUser }

// Get leaves
GET /api/leaves

// Get leave by ID
GET /api/leaves/<id>

// Approve/Reject
PUT /api/leaves/<id>/approve
PUT /api/leaves/<id>/reject { rejectionReason }
```

### Profile
```javascript
// Get profile
GET /api/profile/<user_id>

// Update profile
POST /api/profile/<user_id>
{ phone, department, designation, photo_url }
```

## 🎓 How It Works

1. **User signs up** → React sends email/password → Flask stores in MySQL
2. **User logs in** → Flask generates JWT token → Stored in localStorage
3. **User makes request** → React includes token in Authorization header
4. **Flask validates token** → Processes request → Returns data
5. **React displays** → User sees success message/data

## 🔐 Security Reminder

Current setup is for **development only**:
- Passwords stored as plain text (use bcrypt in production)
- JWT secret is hardcoded (use environment variables)
- CORS allows localhost only (restrict for production)
- No HTTPS (use SSL in production)

## 📞 Common Tasks

### View all users
```bash
mysql -u root -p user_auth -e "SELECT id, username, email, role FROM users;"
```

### Reset database
```bash
mysql -u root -p user_auth < db_schema.sql
```

### Check Flask logs
Look in the Flask terminal where you ran `python app.py`

### Check React logs  
Open browser DevTools → Console tab

### Stop Flask server
In Flask terminal: `Ctrl+C`

### Stop React server
In React terminal: `Ctrl+C`

---
**Everything is ready!** Just run both commands above and test. 🚀
