# 🚀 COMPLETE DEPLOYMENT GUIDE - TechTimeOff on Vercel

## ⚠️ CRITICAL ISSUE

**Your backend is NOT deployed!** You've only deployed the frontend. The backend is still on `localhost:5000`, which means:

❌ **Your deployed website CANNOT work** because:
- Frontend (Vercel): `https://teachtimeoff.vercel.app` ✅ 
- Backend: `http://localhost:5000` ❌ (only on your computer!)

**Solution**: Deploy backend to **Vercel** (yes, Vercel can host Node.js backends too!)

---

## 📋 Step-by-Step Fix

### Step 1: Fix MongoDB Atlas IP Whitelist

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Login** with your account
3. **Network Access** (left sidebar)
4. **Click "Add IP Address"**
5. **Select "Allow Access from Anywhere"** → `0.0.0.0/0`
6. **Click "Confirm"**

This allows Vercel servers to connect to your MongoDB.

---

### Step 2: Deploy Backend to Vercel

#### A. Create `vercel.json` in backend folder

Create this file: `/backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### B. Install Vercel CLI

```bash
npm install -g vercel
```

#### C. Deploy Backend

```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → Your account
- **Link to existing project?** → N
- **Project name?** → techtimeoff-backend
- **Directory?** → Press Enter (current directory)
- **Override settings?** → N

**Wait for deployment...** You'll get a URL like:
```
https://techtimeoff-backend.vercel.app
```

#### D. Add Environment Variables to Vercel Backend

Go to: https://vercel.com/dashboard

1. **Select `techtimeoff-backend` project**
2. **Settings** → **Environment Variables**
3. **Add these variables**:

```
MONGODB_URI = mongodb+srv://Prem:Prem%241710@cluster0.wv2ni.mongodb.net/Imaginify?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET = your_super_secret_jwt_key_change_this_in_production_12345

SESSION_SECRET = your_random_session_secret_here_change_in_production

FRONTEND_URL = https://teachtimeoff.vercel.app

GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET=REDACTED_GOOGLE_CLIENT_SECRET

GOOGLE_CALLBACK_URL = https://teachtimeoff-backend.vercel.app/api/auth/google/callback

GITHUB_CLIENT_ID = Ov23lipWCSU1Noslpi2z

GITHUB_CLIENT_SECRET = 038912411db22817c2b48de7ed5a62f1812428ff

GITHUB_CALLBACK_URL = https://teachtimeoff-backend.vercel.app/api/auth/github/callback

NODE_ENV = production
```

4. **Redeploy** → Go to "Deployments" → Click "Redeploy"

---

### Step 3: Update Frontend Environment Variable

Go to: https://vercel.com/dashboard

1. **Select `teachtimeoff` (frontend) project**
2. **Settings** → **Environment Variables**
3. **Add/Update**:

```
VITE_API_URL = https://teachtimeoff-backend.vercel.app/api
```

4. **Redeploy frontend** → Deployments → Redeploy

---

### Step 4: Update OAuth Callback URLs

#### Google Cloud Console:

1. Go to: https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. **Edit your OAuth 2.0 Client**
4. **Authorized redirect URIs** → Add:
   ```
   https://teachtimeoff-backend.vercel.app/api/auth/google/callback
   ```
5. **Save**

#### GitHub OAuth App:

1. Go to: https://github.com/settings/developers
2. **Click your OAuth App**
3. **Authorization callback URL** → Update to:
   ```
   https://teachtimeoff-backend.vercel.app/api/auth/github/callback
   ```
4. **Update application**

---

### Step 5: Test Your Deployed App

1. **Open**: https://teachtimeoff.vercel.app
2. **Click**: "Sign in with GitHub"
3. **Should work!** ✅

---

## 🔧 Quick Commands

```bash
# Fix MongoDB connection string
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend

# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Prem:Prem%241710@cluster0.wv2ni.mongodb.net/Imaginify?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => { console.log('✅ Connected'); process.exit(0); })
  .catch(err => { console.log('❌ Failed:', err.message); process.exit(1); });
"

# Deploy backend to Vercel
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod
```

---

## ✅ Checklist

### MongoDB Atlas:
- [ ] Login to https://cloud.mongodb.com
- [ ] Network Access → Allow 0.0.0.0/0
- [ ] Test connection locally first

### Backend Deployment:
- [ ] Create `vercel.json` in backend folder
- [ ] Deploy: `cd backend && vercel --prod`
- [ ] Add all environment variables in Vercel dashboard
- [ ] Update callback URLs to use backend URL
- [ ] Redeploy backend

### Frontend Update:
- [ ] Add `VITE_API_URL` env variable (backend URL)
- [ ] Redeploy frontend

### OAuth Configuration:
- [ ] Google Console: Update redirect URI
- [ ] GitHub Settings: Update callback URL
- [ ] Both should point to `https://techtimeoff-backend.vercel.app/api/auth/.../callback`

### Testing:
- [ ] Open https://teachtimeoff.vercel.app
- [ ] Test email login
- [ ] Test Google login
- [ ] Test GitHub login

---

## 🆘 Troubleshooting

### "MongoDB connection failed"
- Check IP whitelist: Allow `0.0.0.0/0`
- Verify password is URL-encoded: `Prem$1710` → `Prem%241710`

### "CORS error"
- Backend env has correct `FRONTEND_URL`
- Frontend env has correct `VITE_API_URL`

### "OAuth redirect URI mismatch"
- Google/GitHub callback URLs match backend deployment URL
- No trailing slashes

---

## 📝 Important Notes

1. **Both frontend AND backend must be deployed**
2. **Backend callback URLs must use backend domain**, not frontend
3. **MongoDB must allow connections from anywhere (0.0.0.0/0)**
4. **All env variables must be set in Vercel dashboard**

---

## 🎯 Your Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://teachtimeoff.vercel.app` (already deployed)
- **Backend**: `https://teachtimeoff-backend.vercel.app` (need to deploy)
- **MongoDB**: `cluster0.wv2ni.mongodb.net` (already created)

---

**Start with MongoDB Atlas IP whitelist, then deploy backend!**
