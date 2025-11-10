# Setup Instructions - Web3Forms Integration

Your website is configured to work with **Web3Forms**, a free email service that works perfectly with GitHub Pages and static websites.

## Step 1: Get Your Web3Forms Access Key (2 minutes)

1. Go to **[https://web3forms.com](https://web3forms.com)**
2. Click **"Create Access Key"**
3. Enter your email: **matt.lenzie@construction-capital.co.uk**
4. Click **"Create Access Key"**
5. Check your email and verify your address
6. Copy the Access Key (it looks like: `abc123def-4567-89gh-ijkl-mnopqrstuvwx`)

## Step 2: Add Access Key to Your Website (1 minute)

Replace `YOUR_WEB3FORMS_ACCESS_KEY` in these two files:

### File 1: index.html

Find line 962 and replace:
```javascript
formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
```

With your actual key:
```javascript
formData.append('access_key', 'abc123def-4567-89gh-ijkl-mnopqrstuvwx');
```

### File 2: contact.html

Find line 212 and replace:
```javascript
formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
```

With your actual key:
```javascript
formData.append('access_key', 'abc123def-4567-89gh-ijkl-mnopqrstuvwx');
```

## Step 3: Commit and Push to GitHub

```bash
git add index.html contact.html
git commit -m "Add Web3Forms access key"
git push origin main
```

## Step 4: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/mattylll/constructioncapital
2. Click **Settings** → **Pages**
3. Under **Source**, select **main** branch
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. Your site will be live at: **https://mattylll.github.io/constructioncapital/**

## How It Works

When someone submits a form:
1. Form data is sent to Web3Forms API
2. Web3Forms formats it nicely and emails it to: **matt.lenzie@construction-capital.co.uk**
3. You receive a professional email with all the lead details
4. No server, no PHP, no database needed!

## What You'll Receive

Every form submission sends an email like this:

```
Subject: New Lead from Construction Capital Website

New lead received from Construction Capital website:

Name: John Smith
Email: john@example.com
Phone: 07700 900000
Company: ABC Developments
Funding Type: Development Finance
Project Value: £2,000,000

Message:
Looking for development finance for a 10-unit residential
project in Manchester. Planning approved.

---
Submitted: 10/11/2024, 14:30:00
Source: Contact Page
```

## Optional: Custom Domain

If you want to use **constructioncapital.co.uk** instead of the GitHub URL:

1. Add a CNAME file to your repository with: `constructioncapital.co.uk`
2. In your domain registrar (GoDaddy, Namecheap, etc), add these DNS records:
   - Type: **CNAME**
   - Host: **www**
   - Value: **mattylll.github.io**

3. Type: **A** Records (add all 4):
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

## Support

- **Web3Forms Documentation**: https://docs.web3forms.com
- **GitHub Pages Documentation**: https://docs.github.com/en/pages

## Alternative: Formspree (if you prefer)

If you'd rather use Formspree instead:

1. Sign up at https://formspree.io
2. Create a new form
3. Replace `https://api.web3forms.com/submit` with your Formspree endpoint
4. Remove the `access_key` line
5. Done!

---

**That's it!** Your website will be live and capturing leads within 5 minutes.
