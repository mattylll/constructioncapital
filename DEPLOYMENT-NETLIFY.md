# Deploy to Netlify (Recommended - More Secure!)

## Why Netlify Instead of GitHub Pages?

✅ **Much More Secure:**
- No API keys exposed in your code
- Form handling is server-side
- Built-in spam protection
- Submissions stored securely

✅ **Better Features:**
- Free SSL certificate
- Automatic deployments from GitHub
- Form submission dashboard
- Email notifications
- Downloadable form data as CSV

✅ **Still FREE** for your needs!

---

## Quick Deploy (5 Minutes)

### Step 1: Sign Up for Netlify

1. Go to **https://netlify.com**
2. Click **"Sign up"** and use your GitHub account
3. Authorize Netlify to access your repositories

### Step 2: Deploy Your Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Select your repository: **mattylll/constructioncapital**
4. Build settings:
   - **Build command:** Leave blank
   - **Publish directory:** Leave blank (or put `.`)
5. Click **"Deploy site"**

**That's it!** Your site will be live in about 30 seconds at: `https://random-name-12345.netlify.app`

### Step 3: Set Up Form Notifications

1. In your Netlify dashboard, go to **Site settings**
2. Click **Forms** in the left sidebar
3. Scroll to **Form notifications**
4. Click **"Add notification"** → **"Email notification"**
5. Enter your email: **matt.lenzie@construction-capital.co.uk**
6. Select **"New form submission"**
7. Click **"Save"**

Now you'll get emails for every form submission!

### Step 4: Add Custom Domain (Optional)

If you want to use **constructioncapital.co.uk**:

1. In Netlify, go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter: `constructioncapital.co.uk`
4. Follow the DNS instructions provided by Netlify
5. Netlify will automatically provision a FREE SSL certificate

---

## What You Get

### 📧 Email Notifications

Every form submission sends you an email like:

```
Subject: New form submission from Construction Capital

Form: homepage-contact
Submission Date: 10 Nov 2024, 14:30

firstName: John
lastName: Smith
email: john@example.com
phone: 07700 900000
company: ABC Developments
fundingType: Development Finance
projectValue: 2000000
message: Looking for development finance...
```

### 📊 Netlify Dashboard

View all submissions in your Netlify dashboard:
- See all form data
- Export to CSV
- Filter and search
- Delete spam submissions

### 🔒 Security Features

- **Honeypot field** - catches bots automatically
- **reCAPTCHA** - can be enabled if needed
- **Akismet spam filtering** - available on paid plans
- **No exposed API keys** - everything is server-side

---

## Viewing Submissions

### In Netlify Dashboard:

1. Go to your site in Netlify
2. Click **"Forms"** tab
3. View all submissions with full details
4. Export to CSV anytime

### Via Email:

You'll receive instant email notifications at **matt.lenzie@construction-capital.co.uk**

---

## Continuous Deployment

Every time you push to GitHub:
1. Netlify automatically detects the change
2. Deploys your updated site (takes ~30 seconds)
3. Your site is always up to date

No manual uploading needed!

---

## Cost

**100% FREE** for your needs:
- Unlimited form submissions per month
- 100 GB bandwidth per month
- 300 build minutes per month
- Free SSL certificate
- Automatic deployments

---

## Support

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Forms:** https://docs.netlify.com/forms/setup/

---

## Quick Reference

**Your Repository:** https://github.com/mattylll/constructioncapital

**Deploy to Netlify:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mattylll/constructioncapital)

---

## Comparison: Netlify vs GitHub Pages

| Feature | Netlify | GitHub Pages |
|---------|---------|--------------|
| Form handling | ✅ Built-in & secure | ❌ Need 3rd party API |
| API keys | ✅ None needed | ❌ Exposed in code |
| Spam protection | ✅ Built-in | ⚠️ Manual setup |
| Form data storage | ✅ Dashboard & CSV | ❌ None |
| Email notifications | ✅ Built-in | ⚠️ Via 3rd party |
| Custom domain | ✅ Easy | ✅ Easy |
| SSL | ✅ Automatic | ✅ Automatic |
| Deployment | ✅ Auto from GitHub | ✅ Auto from GitHub |
| Cost | 💚 FREE | 💚 FREE |

**Recommendation:** Use Netlify for better security and features!
