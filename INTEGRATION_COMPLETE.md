                                                                                       # TechTimeoff: Flask Backend + React Frontend Integration - Complete Setup

## ✅ What's Been Done

### 1. **Backend: Flask API Endpoints Added**
All authentication endpoints have been added to `/app.py`:

- **POST `/api/auth/register`** - User registration
  - Body: `{ email, username, password, role }`
  - Returns: `{ success, token, user }`

- **POST `/api/auth/login`** - User login
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`

- **GET `/api/auth/me`** - Get current user (requires Bearer token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, user }`

### 2. **Frontend: API Configuration Updated**
- `src/utils/api-auth.js` - Already Flask-compatible
- `src/contexts/AuthContext.jsx` - Updated MongoDB reference to Flask API
- `.env.development` & `.env.production` - Created with `VITE_API_URL=http://localhost:5000/api`

### 3. **Dependencies Installed**
Added to `requirements.txt`:
- `flask` - Web framework
- `flask-cors` - CORS support for React frontend
- `mysql-connector-python` - MySQL database connection
- `pyjwt` - JWT token generation and validation

## 🚀 How to Run

### **Step 1: Start the Flask Backend**
```bash
cd c:\Users\Ej327ws\New folder (2)\TechTimeoff
python app.py
```
Backend will run on `http://localhost:5000`

### **Step 2: Start the React Frontend**
In a new terminal:
```bash
cd c:\Users\Ej327ws\New folder (2)\TechTimeoff
npm run dev
```
Frontend will run on `http://localhost:5174` or `http://localhost:5175`

## 🔄 Data Flow

### **1. User Registration**
```
React Component (Signup.jsx)
    ↓
authenticateUser() [api-auth.js]
    ↓
POST /api/auth/register
    ↓
Flask: Creates user in MySQL database
    ↓
Generates JWT token
    ↓
Returns { token, user }
    ↓
AuthContext stores user state + token in localStorage
    ↓
React Component receives authenticated user
```

### **2. User Login**
```
React Component (Login.jsx)
    ↓
authenticateUser() [api-auth.js]
    ↓
POST /api/auth/login
    ↓
Flask: Queries MySQL for user by email+password
    ↓
Generates JWT token
    ↓
Returns { token, user }
    ↓
AuthContext stores user state + token in localStorage
    ↓
Navigate to appropriate dashboard based on role
```

### **3. Leave Request Submission**
```
React Component (LeaveRequest.jsx)
    ↓
createLeaveRequest() [api-auth.js]
    ↓
POST /api/leave
    ↓
Flask: Inserts into leave_requests table
    ↓
Returns { success, leave_id }
    ↓
Frontend shows success message + displays in table
```

### **4. Profile Management**
```
React Component (Profile.jsx)
    ↓
updateUserProfile() [api-auth.js]
    ↓
PUT /api/users/{userId}
    ↓
Flask: Updates user_profiles table
    ↓
Returns { success, user }
    ↓
Frontend updates user state
```

## 📊 Database Schema (user_auth)

### `users` table
```
id (PK)
username (UNIQUE)
email (UNIQUE)
password
role (faculty|coordinator|chief_coordinator|principal)
created_at
updated_at
```

### `leave_requests` table
```
id (PK)
user_id (FK to users.id)
requester_id (FK to users.id - who submitted)
start_date
end_date
days
leave_type
note
status (pending|approved|rejected)
notify (user_id - who to notify)
created_at
updated_at
```

### `user_profiles` table
```
user_id (PK/FK to users.id)
phone
department
designation
photo_url
created_at
updated_at
```

## 🔐 Authentication Flow

1. **Frontend sends credentials** → `/api/auth/login`
2. **Backend validates** and generates JWT token with user info
3. **Frontend stores token** in localStorage
4. **Subsequent requests** include token in `Authorization: Bearer <token>` header
5. **Backend verifies token** using `@token_required` decorator
6. **Token contains**: `{ user_id, username, email }`

## 🌐 CORS Configuration

Frontend can access backend from:
- `http://localhost:5174` ✅
- `http://localhost:5175` ✅

If you deploy to production, update CORS in `app.py`:
```python
CORS(app, resources={r"/api/*": {"origins": "your-production-url"}})
```

## 🧪 Testing the Integration

### Test 1: Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "role": "faculty"
  }'
```

### Test 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 3: Get current user (requires token from login)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ⚠️ Important Notes

1. **JWT Secret**: Currently set to `'dev-secret-key-change-in-production'` in `app.py`. 
   - For production, set environment variable: `JWT_SECRET=your-secret-key`

2. **Password Security**: Currently stored as plain text. 
   - Recommended: Use `werkzeug.security` for password hashing
   ```python
   from werkzeug.security import generate_password_hash, check_password_hash
   ```

3. **Token Expiration**: Currently tokens never expire.
   - For production, add expiration:
   ```python
   'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
   ```

4. **Database Credentials**: Hard-coded in `app.py`.
   - For production, use environment variables:
   ```python
   host=os.environ.get('DB_HOST', 'localhost')
   user=os.environ.get('DB_USER', 'root')
   password=os.environ.get('DB_PASSWORD', 'password')
   ```

## 📁 File Structure

```
TechTimeoff/
├── app.py                          ← Main Flask API
├── requirements.txt                ← Python dependencies
├── .env.development                ← Dev environment variables
├── .env.production                 ← Prod environment variables
├── src/
│   ├── pages/
│   │   ├── Login.jsx               ← Uses authenticateUser()
│   │   ├── Signup.jsx              ← Uses registerUser()
│   │   ├── LeaveRequest.jsx        ← Uses createLeaveRequest()
│   │   └── Profile.jsx             ← Uses updateUserProfile()
│   ├── contexts/
│   │   └── AuthContext.jsx         ← Manages user state & token
│   └── utils/
│       └── api-auth.js             ← API utility functions
└── routes/
    └── profile_routes.py           ← Profile management routes
```

## 🔗 Frontend → Backend Mapping

| Frontend Function | API Endpoint | Method |
|------------------|-------------|--------|
| `authenticateUser()` | `/api/auth/login` | POST |
| `registerUser()` | `/api/auth/register` | POST |
| `fetchCurrentUser()` | `/api/auth/me` | GET |
| `createLeaveRequest()` | `/api/leave` | POST |
| `getLeaveRequests()` | `/api/leaves` | GET |
| `updateUserProfile()` | `/api/users/{id}` | PUT |
| `getAllUsers()` | `/api/users` | GET |

## ✨ Next Steps

1. ✅ **Test login/register** in the React app
2. ✅ **Verify leave requests** are stored in MySQL
3. ✅ **Test profile updates**
4. ✅ Check console logs for `🔧 API URL:` to confirm environment variables are loaded
5. 🔒 **Implement password hashing** for security
6. 🔐 **Add OAuth endpoints** if needed (GitHub/Google login)
7. 📱 **Add role-based access control** to dashboard pages
8. 🚀 **Deploy to production** (update CORS, environment variables, SSL)

---

**Status**: ✅ Ready for testing
**Backend**: Flask running on port 5000
**Frontend**: React/Vite on port 5174/5175
**Database**: MySQL (user_auth) with all tables ready
