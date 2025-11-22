# ✅ DEPLOYMENT CHECKLIST - Complete Before Testing

## 🚨 CRITICAL: You MUST Deploy Backend First!

Your website is NOT working because:
- ✅ Frontend deployed to Vercel
- ❌ Backend NOT deployed (still on localhost)

---

## 📋 Quick Fix Steps (15 minutes)

### 1️⃣ MongoDB Atlas IP Whitelist (2 min)

```
1. Go to: https://cloud.mongodb.com
2. Click: Network Access (left sidebar)
3. Click: Add IP Address
4. Select: Allow Access from Anywhere (0.0.0.0/0)
5. Click: Confirm
```

**Why?** Vercel servers need to connect to your MongoDB.

---

### 2️⃣ Deploy Backend to Vercel (5 min)

```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod
```

**Answer prompts:**
- Set up and deploy? → **Y**
- Link to existing project? → **N**
- Project name? → **techtimeoff-backend**
- Directory? → **Press Enter**

**You'll get:** `https://techtimeoff-backend.vercel.app`

---

### 3️⃣ Add Backend Environment Variables (3 min)

Go to: https://vercel.com → techtimeoff-backend → Settings → Environment Variables

Add ALL these:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://Prem:Prem%241710@cluster0.wv2ni.mongodb.net/Imaginify?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `your_super_secret_jwt_key_change_this_in_production_12345` |
| `SESSION_SECRET` | `your_random_session_secret_here_change_in_production` |
| `FRONTEND_URL` | `https://teachtimeoff.vercel.app` |
| `GOOGLE_CLIENT_ID` | `REDACTED_GOOGLE_CLIENT_ID` |
| `GOOGLE_CLIENT_SECRET` | `REDACTED_GOOGLE_CLIENT_SECRET` |
| `GOOGLE_CALLBACK_URL` | `https://teachtimeoff-backend.vercel.app/api/auth/google/callback` |
| `GITHUB_CLIENT_ID` | `Ov23lipWCSU1Noslpi2z` |
| `GITHUB_CLIENT_SECRET` | `038912411db22817c2b48de7ed5a62f1812428ff` |
| `GITHUB_CALLBACK_URL` | `https://teachtimeoff-backend.vercel.app/api/auth/github/callback` |
| `NODE_ENV` | `production` |

Then: **Deployments → Redeploy**

---

### 4️⃣ Update Frontend Environment Variable (2 min)

Go to: https://vercel.com → teachtimeoff → Settings → Environment Variables

**Add/Update:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://teachtimeoff-backend.vercel.app/api` |

Then: **Deployments → Redeploy**

---

### 5️⃣ Update OAuth Callback URLs (3 min)

#### Google:
1. https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit OAuth Client
4. Authorized redirect URIs → Add:
   ```
   https://teachtimeoff-backend.vercel.app/api/auth/google/callback
   ```
5. Save

#### GitHub:
1. https://github.com/settings/developers
2. Click your OAuth App
3. Authorization callback URL:
   ```
   https://teachtimeoff-backend.vercel.app/api/auth/github/callback
   ```
4. Update

---

## 🧪 Test Your App

After completing ALL steps above:

1. **Open**: https://teachtimeoff.vercel.app
2. **Try Email Login**:
   - Email: `faculty@jims.edu`
   - Password: `faculty123`
3. **Try OAuth**:
   - Click "Continue with GitHub"
   - Click "Continue with Google"

---

## ❌ Common Errors

### "MongoDB connection failed"
→ **Fix**: Allow 0.0.0.0/0 in MongoDB Atlas Network Access

### "CORS error"
→ **Fix**: Backend env has `FRONTEND_URL = https://teachtimeoff.vercel.app`

### "OAuth redirect URI mismatch"
→ **Fix**: Google/GitHub callback URLs use backend domain, not frontend

### "Cannot connect to localhost:5000"
→ **Fix**: Deploy backend to Vercel first!

---

## 📝 Files I Created for You

1. ✅ `/backend/vercel.json` - Vercel backend config
2. ✅ `/backend/deploy.sh` - Deployment helper script
3. ✅ `VERCEL_DEPLOYMENT.md` - Detailed guide
4. ✅ Fixed MongoDB connection string in `.env`

---

## 🎯 Summary

**What's wrong:**
- Backend is on localhost (can't be accessed from Vercel frontend)

**What you need:**
1. Deploy backend to Vercel
2. Add environment variables
3. Update OAuth callback URLs
4. Update frontend to use backend URL

**Time needed:** 15 minutes

**Start here:** Run `cd backend && vercel --prod`

---

## 🆘 Need Help?

Run the deployment helper:
```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
./deploy.sh
```

Or follow the detailed guide in `VERCEL_DEPLOYMENT.md`.

---

**⚡ Quick Command:**

```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend && vercel --prod
```

**Then add env variables in Vercel dashboard!**
