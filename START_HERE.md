# 🎯 FINAL DEPLOYMENT INSTRUCTIONS

## ✅ What I've Done for You

1. ✅ Fixed MongoDB connection string (password URL-encoded: `Prem%241710`)
2. ✅ Created `backend/vercel.json` for Vercel deployment
3. ✅ Installed Vercel CLI on your system
4. ✅ Updated all `.env` files with correct configurations
5. ✅ Created deployment guides and checklists

---

## 🚀 What You Need to Do Now (10 Steps - 15 minutes)

### Step 1: MongoDB Atlas IP Whitelist (CRITICAL!)

**Without this, MongoDB will NOT work on Vercel!**

1. Go to: **https://cloud.mongodb.com**
2. **Login** with your MongoDB account
3. Click **"Network Access"** (left sidebar)
4. Click **"Add IP Address"** button
5. Click **"Allow Access from Anywhere"**
6. IP will be: `0.0.0.0/0`
7. Click **"Confirm"**

**Wait 1-2 minutes for changes to apply**

---

### Step 2: Login to Vercel

```bash
vercel login
```

Choose your login method (GitHub, GitLab, Email, etc.)

---

### Step 3: Deploy Backend

```bash
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod
```

**Answer the prompts:**
```
? Set up and deploy "~/Desktop/kittu/TechTimeoff/backend"? → Y
? Which scope do you want to deploy to? → [Your Account]
? Link to existing project? → N
? What's your project's name? → techtimeoff-backend
? In which directory is your code located? → ./  (Press Enter)
? Want to override the settings? → N
```

**Wait for deployment...**

You'll see something like:
```
✅ Production: https://techtimeoff-backend.vercel.app [copied to clipboard]
```

**COPY THIS URL!** You'll need it for next steps.

---

### Step 4: Add Environment Variables to Backend

1. Go to: **https://vercel.com/dashboard**
2. Click on **"techtimeoff-backend"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** (left sidebar)
5. **Add these 11 variables ONE BY ONE:**

#### Variable 1:
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://Prem:Prem%241710@cluster0.wv2ni.mongodb.net/Imaginify?retryWrites=true&w=majority&appName=Cluster0`
- Click "Save"

#### Variable 2:
- **Name:** `JWT_SECRET`
- **Value:** `your_super_secret_jwt_key_change_this_in_production_12345`
- Click "Save"

#### Variable 3:
- **Name:** `SESSION_SECRET`
- **Value:** `your_random_session_secret_here_change_in_production`
- Click "Save"

#### Variable 4:
- **Name:** `FRONTEND_URL`
- **Value:** `https://teachtimeoff.vercel.app`
- Click "Save"

#### Variable 5:
- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** `YOUR_GOOGLE_CLIENT_ID` (Get from Google Cloud Console)
- Click "Save"

#### Variable 6:
- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** `YOUR_GOOGLE_CLIENT_SECRET` (Get from Google Cloud Console)
- Click "Save"

#### Variable 7:
- **Name:** `GOOGLE_CALLBACK_URL`
- **Value:** `https://teachtimeoff-backend.vercel.app/api/auth/google/callback`
- (Replace `teachtimeoff-backend.vercel.app` with YOUR actual backend URL from Step 3)
- Click "Save"

#### Variable 8:
- **Name:** `GITHUB_CLIENT_ID`
- **Value:** `Ov23lipWCSU1Noslpi2z`
- Click "Save"

#### Variable 9:
- **Name:** `GITHUB_CLIENT_SECRET`
- **Value:** `038912411db22817c2b48de7ed5a62f1812428ff`
- Click "Save"

#### Variable 10:
- **Name:** `GITHUB_CALLBACK_URL`
- **Value:** `https://teachtimeoff-backend.vercel.app/api/auth/github/callback`
- (Replace `teachtimeoff-backend.vercel.app` with YOUR actual backend URL from Step 3)
- Click "Save"

#### Variable 11:
- **Name:** `NODE_ENV`
- **Value:** `production`
- Click "Save"

---

### Step 5: Redeploy Backend

After adding ALL environment variables:

1. Click **"Deployments"** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment to finish

---

### Step 6: Update Frontend Environment Variable

1. Go to: **https://vercel.com/dashboard**
2. Click on **"teachtimeoff"** (your frontend project)
3. Click **"Settings"** tab
4. Click **"Environment Variables"**
5. **Add this variable:**

- **Name:** `VITE_API_URL`
- **Value:** `https://teachtimeoff-backend.vercel.app/api`
- (Replace with YOUR actual backend URL from Step 3)
- Click "Save"

---

### Step 7: Redeploy Frontend

1. Stay in **teachtimeoff** project
2. Click **"Deployments"** tab
3. Click **three dots (...)** on latest deployment
4. Click **"Redeploy"**
5. Wait for redeployment

---

### Step 8: Update Google OAuth Callback URL

1. Go to: **https://console.cloud.google.com**
2. Make sure correct project is selected (top-left dropdown)
3. Click **"APIs & Services"** (left sidebar)
4. Click **"Credentials"**
5. Find your **OAuth 2.0 Client ID** and click **Edit**
6. Scroll to **"Authorized redirect URIs"**
7. Click **"+ ADD URI"**
8. Enter: `https://teachtimeoff-backend.vercel.app/api/auth/google/callback`
   - (Replace with YOUR actual backend URL)
9. Click **"SAVE"**

---

### Step 9: Update GitHub OAuth Callback URL

1. Go to: **https://github.com/settings/developers**
2. Click **"OAuth Apps"**
3. Click on your app (the one with Client ID: `Ov23lipWCSU1Noslpi2z`)
4. Find **"Authorization callback URL"**
5. **Update to:** `https://teachtimeoff-backend.vercel.app/api/auth/github/callback`
   - (Replace with YOUR actual backend URL)
6. Click **"Update application"**

---

### Step 10: Test Your Deployed App!

1. **Open:** https://teachtimeoff.vercel.app
2. **Wait a few seconds** for page to load
3. **Test Email Login:**
   - Select role: Faculty
   - Email: `faculty@jims.edu`
   - Password: `faculty123`
   - Click "Sign In"

4. **Test GitHub OAuth:**
   - Click "Continue with GitHub"
   - Authorize the app
   - Should redirect back and login!

5. **Test Google OAuth:**
   - Click "Continue with Google"
   - Select your Google account
   - Should redirect back and login!

---

## ✅ Success Checklist

Check all these before testing:

- [ ] MongoDB Atlas allows 0.0.0.0/0 IP access
- [ ] Backend deployed to Vercel
- [ ] All 11 environment variables added to backend
- [ ] Backend redeployed after adding env vars
- [ ] Frontend env variable `VITE_API_URL` added
- [ ] Frontend redeployed
- [ ] Google OAuth callback URL updated
- [ ] GitHub OAuth callback URL updated
- [ ] Website loads at https://teachtimeoff.vercel.app
- [ ] Email login works
- [ ] GitHub OAuth works
- [ ] Google OAuth works

---

## 🆘 Troubleshooting

### "Cannot connect to database"
→ Check MongoDB Atlas Network Access allows 0.0.0.0/0

### "CORS error"
→ Check backend has `FRONTEND_URL=https://teachtimeoff.vercel.app`

### "OAuth redirect URI mismatch"
→ Make sure Google/GitHub callback URLs use **backend URL**, not frontend

### "Internal Server Error"
→ Check backend logs in Vercel: Dashboard → teachtimeoff-backend → Deployments → View Function Logs

### "401 Unauthorized"
→ Check `JWT_SECRET` and `SESSION_SECRET` are set in backend env vars

---

## 📊 Your Final Architecture

```
User Browser
     ↓
https://teachtimeoff.vercel.app (Frontend - React/Vite)
     ↓
https://teachtimeoff-backend.vercel.app (Backend - Node.js/Express)
     ↓
cluster0.wv2ni.mongodb.net (MongoDB Atlas)
```

---

## 🎉 After Everything Works

Your app will have:
- ✅ Email/password login
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Real database (MongoDB Atlas)
- ✅ Deployed and accessible worldwide

---

## 📝 Important Notes

1. **Backend URL**: `https://teachtimeoff-backend.vercel.app`
   - Replace this with YOUR actual URL from deployment
   - Use this URL in ALL OAuth callbacks

2. **Environment Variables**: Must be added in Vercel dashboard
   - `.env` files are NOT deployed to Vercel
   - Must manually add each variable

3. **Redeployment**: After adding env vars, MUST redeploy
   - Changes don't take effect until redeployment

4. **OAuth Callbacks**: Must use **backend URL**, not frontend
   - Google: `https://YOUR-BACKEND.vercel.app/api/auth/google/callback`
   - GitHub: `https://YOUR-BACKEND.vercel.app/api/auth/github/callback`

---

## ⏱️ Total Time: 15-20 minutes

- MongoDB setup: 2 min
- Backend deployment: 3 min
- Environment variables: 5 min
- Frontend update: 2 min
- OAuth updates: 3 min
- Testing: 5 min

---

## 🚀 Quick Commands Summary

```bash
# Login to Vercel
vercel login

# Deploy backend
cd /Users/premprasad/Desktop/kittu/TechTimeoff/backend
vercel --prod

# After deployment, add env vars in dashboard and redeploy
```

---

**🎯 START NOW:** Follow Step 1 (MongoDB Atlas IP Whitelist)

Then proceed through each step in order. Don't skip any step!

**Good luck! Your app will be fully working soon! 🚀**
