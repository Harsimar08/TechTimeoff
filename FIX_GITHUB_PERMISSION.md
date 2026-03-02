# 🔐 Fix: GitHub Permission Denied Error

## ❌ The Problem

```
error: failed to push some refs to 'https://github.com/prem-prasad1710/TechTimeoff.git'
! [remote rejected] kritikay -> kritikay (permission denied)
```

**Reason:** GitHub requires authentication, and password authentication is no longer supported for HTTPS.

---

## ✅ Solution 1: Use Personal Access Token (PAT) - RECOMMENDED

### Step 1: Create a Personal Access Token

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub.com → Click your profile picture (top right) → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token:**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   
3. **Configure Token:**
   - **Note:** Give it a name like "TechTimeoff Access"
   - **Expiration:** Choose 90 days (or custom)
   - **Select scopes:** Check the following boxes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
   
4. **Generate & Copy:**
   - Click **"Generate token"** at the bottom
   - **IMPORTANT:** Copy the token immediately! You won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Configure Git to Use Token

**Option A - Cache credentials (easier):**
```bash
# Enable credential caching for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# Now push - it will ask for username and password
git push origin kritikay

# When prompted:
# Username: prem-prasad1710
# Password: [paste your token here - NOT your GitHub password!]
```

**Option B - Store credentials permanently (macOS Keychain):**
```bash
# Use macOS Keychain to store credentials
git config --global credential.helper osxkeychain

# Now push
git push origin kritikay

# When prompted:
# Username: prem-prasad1710
# Password: [paste your token here]
# Keychain will save it for future use!
```

---

## ✅ Solution 2: Use SSH Instead of HTTPS (Most Secure)

### Step 1: Check if you have SSH keys
```bash
ls -la ~/.ssh
```

If you see `id_rsa.pub` or `id_ed25519.pub`, you already have keys. Skip to Step 3.

### Step 2: Generate SSH Key (if needed)
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter to accept default file location
# Enter a passphrase (or press Enter for no passphrase)
```

### Step 3: Add SSH Key to SSH Agent
```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key
ssh-add ~/.ssh/id_ed25519
# (or ssh-add ~/.ssh/id_rsa if you have RSA key)
```

### Step 4: Copy SSH Public Key
```bash
# Copy the public key to clipboard
cat ~/.ssh/id_ed25519.pub | pbcopy

# Or display it to copy manually
cat ~/.ssh/id_ed25519.pub
```

### Step 5: Add SSH Key to GitHub
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title:** "MacBook Pro" (or any name)
4. **Key:** Paste the key you copied
5. Click **"Add SSH key"**

### Step 6: Change Remote URL to SSH
```bash
# Change from HTTPS to SSH
git remote set-url origin git@github.com:prem-prasad1710/TechTimeoff.git

# Verify it changed
git remote -v

# Now push without password prompt!
git push origin kritikay
```

---

## ✅ Solution 3: Use GitHub CLI (Easiest)

### Step 1: Install GitHub CLI
```bash
# Install via Homebrew
brew install gh
```

### Step 2: Authenticate
```bash
# Login to GitHub
gh auth login

# Follow prompts:
# - Choose: GitHub.com
# - Choose: HTTPS
# - Authenticate with: Login with a web browser
# - Copy the code shown and paste in browser
```

### Step 3: Push
```bash
# Now push normally
git push origin kritikay
```

---

## 🎯 Quick Fix (Choose ONE)

### **Fastest - Personal Access Token:**
```bash
# 1. Create token: https://github.com/settings/tokens
# 2. Enable credential helper
git config --global credential.helper osxkeychain

# 3. Push (will ask for token)
git push origin kritikay
# Username: prem-prasad1710
# Password: [paste token here]
```

### **Most Secure - SSH:**
```bash
# 1. Generate key (if needed)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 2. Copy public key
cat ~/.ssh/id_ed25519.pub | pbcopy

# 3. Add to GitHub: https://github.com/settings/keys

# 4. Change remote to SSH
git remote set-url origin git@github.com:prem-prasad1710/TechTimeoff.git

# 5. Push
git push origin kritikay
```

### **Easiest - GitHub CLI:**
```bash
# 1. Install
brew install gh

# 2. Login
gh auth login

# 3. Push
git push origin kritikay
```

---

## 🔍 Verify Your Setup

### Check Current Authentication
```bash
# Check remote URL
git remote -v

# Test SSH connection (if using SSH)
ssh -T git@github.com

# Should see: "Hi prem-prasad1710! You've successfully authenticated..."
```

### Check Credential Helper
```bash
# See current credential helper
git config --global credential.helper

# Should show: osxkeychain, cache, or store
```

---

## 📝 After Authentication Works

Once you can push successfully, here's what to do:

```bash
# 1. Add the Git guide file
git add GIT_COMMANDS_GUIDE.md

# 2. Commit it
git commit -m "docs: Add Git commands guide"

# 3. Push everything
git push origin kritikay
```

---

## 🐛 Common Issues

### "Could not read from remote repository"
**Solution:** You don't have permission to this repo.
- Make sure you're the owner or have been added as a collaborator
- Check: https://github.com/prem-prasad1710/TechTimeoff/settings/access

### "Host key verification failed"
**Solution:** Add GitHub to known hosts
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

### Token doesn't work
**Solution:** Make sure you:
- Selected the `repo` scope when creating the token
- Copied the entire token
- Used the token as password (not your GitHub password)

### SSH key not working
**Solution:** Make sure you:
- Added the PUBLIC key (`.pub` file) to GitHub
- Added the PRIVATE key to ssh-agent
- Changed remote URL to SSH format: `git@github.com:user/repo.git`

---

## ✅ Recommended Setup (Best for Long-term)

**I recommend using SSH** because:
- ✅ No need to enter credentials every time
- ✅ More secure than tokens
- ✅ Never expires (unlike tokens)
- ✅ Works across all Git operations

**Quick SSH Setup:**
```bash
# 1. Generate key
ssh-keygen -t ed25519 -C "your-email@example.com"

# 2. Start agent and add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copy public key
cat ~/.ssh/id_ed25519.pub | pbcopy

# 4. Add to GitHub: https://github.com/settings/keys

# 5. Update remote
git remote set-url origin git@github.com:prem-prasad1710/TechTimeoff.git

# 6. Test
ssh -T git@github.com

# 7. Push!
git push origin kritikay
```

**Done! You'll never need to authenticate again!** 🎉

---

## 📚 Resources

- GitHub PAT Guide: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- GitHub SSH Guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- GitHub CLI: https://cli.github.com/

---

**Choose your preferred method and let's get your code pushed to GitHub! 🚀**
