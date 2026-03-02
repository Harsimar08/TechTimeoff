# 🚨 URGENT: Your App is NOT Working - Here's Why

## ❌ The Problem

You deployed **ONLY the frontend** to Vercel:
- Frontend: `https://teachtimeoff.vercel.app` ✅ DEPLOYED
- Backend: `http://localhost:5000` ❌ ONLY ON YOUR COMPUTER

**This means:**
- Your website loads ✅
- But login/OAuth **CANNOT work** ❌
- Because backend is on localhost (not accessible from internet)

---

## ✅ The Solution (3 Steps)

### Step 1: Deploy Backend to Vercel (5 minutes)

```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod
```

**You'll get a URL like:**
```
https://techtimeoff-backend.vercel.app
```

### Step 2: Add Environment Variables in Vercel (5 minutes)

Go to: https://vercel.com/dashboard → techtimeoff-backend → Settings → Environment Variables

**Add these 11 variables:**

```bash
MONGODB_URI=mongodb+srv://Prem:Prem%241710@cluster0.wv2ni.mongodb.net/Imaginify?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

SESSION_SECRET=your_random_session_secret_here_change_in_production

FRONTEND_URL=https://teachtimeoff.vercel.app

GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET=REDACTED_GOOGLE_CLIENT_SECRET

GOOGLE_CALLBACK_URL=https://teachtimeoff-backend.vercel.app/api/auth/google/callback

GITHUB_CLIENT_ID=Ov23lipWCSU1Noslpi2z

GITHUB_CLIENT_SECRET=038912411db22817c2b48de7ed5a62f1812428ff

GITHUB_CALLBACK_URL=https://teachtimeoff-backend.vercel.app/api/auth/github/callback

NODE_ENV=production
```

**Then redeploy backend:** Deployments → Redeploy

### Step 3: Update Frontend to Use Backend URL (2 minutes)

Go to: https://vercel.com/dashboard → teachtimeoff (frontend) → Settings → Environment Variables

**Add:**
```
VITE_API_URL=https://teachtimeoff-backend.vercel.app/api
```

**Then redeploy frontend:** Deployments → Redeploy

---

## 🔧 Bonus: Update OAuth Callback URLs

### Google Console:
1. https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit OAuth Client
4. Authorized redirect URIs → **Add:**
   ```
   https://teachtimeoff-backend.vercel.app/api/auth/google/callback
   ```
5. Save

### GitHub Settings:
1. https://github.com/settings/developers
2. Click your OAuth App
3. Authorization callback URL → **Update to:**
   ```
   https://teachtimeoff-backend.vercel.app/api/auth/github/callback
   ```
4. Update

---

## 📋 What I Fixed for You

✅ **MongoDB connection string** - Fixed password encoding (`Prem$1710` → `Prem%241710`)
✅ **Created `vercel.json`** - Backend deployment config
✅ **Fixed `.env` files** - Correct MongoDB URI
✅ **Created deployment guides** - Step-by-step instructions

---

## 🎯 What You Need to Do

1. **MongoDB Atlas** - Allow 0.0.0.0/0 in Network Access
2. **Deploy Backend** - Run `cd backend && vercel --prod`
3. **Add Env Variables** - In Vercel dashboard (backend project)
4. **Update Frontend** - Add `VITE_API_URL` env variable
5. **Update OAuth** - Callback URLs in Google/GitHub

---

## ⏱️ Time Needed

- **MongoDB setup:** 2 minutes
- **Backend deployment:** 5 minutes
- **Environment variables:** 5 minutes
- **Frontend update:** 2 minutes
- **OAuth updates:** 3 minutes

**Total:** ~15 minutes

---

## 🧪 After Deployment

Test at: **https://teachtimeoff.vercel.app**

**Email Login:**
- Email: `faculty@jims.edu`
- Password: `faculty123`

**OAuth Login:**
- Click "Continue with GitHub"
- Click "Continue with Google"

---

## 📚 Documentation I Created

1. `DEPLOYMENT_CHECKLIST.md` - Quick checklist
2. `VERCEL_DEPLOYMENT.md` - Detailed guide
3. `backend/vercel.json` - Deployment config
4. `backend/deploy.sh` - Helper script

---

## 🚀 Quick Start

```bash
# 1. Deploy backend
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod

# 2. After deployment, update env variables in Vercel dashboard
# 3. Test your app!
```

---

## ❓ Why Did This Happen?

- Vercel deployed your **frontend code**
- But backend is **Node.js server** running on localhost
- Vercel frontend **cannot reach** localhost backend
- Need to deploy backend **separately** to Vercel

---

## 🎉 After Completing Steps

Your architecture will be:

```
User Browser
     ↓
Vercel Frontend (https://teachtimeoff.vercel.app)
     ↓
Vercel Backend (https://teachtimeoff-backend.vercel.app)
     ↓
MongoDB Atlas (cluster0.wv2ni.mongodb.net)
```

**Everything will work!** ✅

---

**START HERE:** Deploy backend now!

```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod
```
