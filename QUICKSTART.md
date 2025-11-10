# Quick Start Guide

Get your Construction Capital website live in 5 minutes!

## Prerequisites

- Web hosting with PHP 7.0+ support
- FTP/SFTP access or cPanel
- Your domain (constructioncapital.co.uk) pointed to your hosting

## Step 1: Upload Files (2 minutes)

Upload all files to your web server's public directory:

```
/public_html/
├── index.html
├── submit-lead.php
├── .htaccess
└── config.example.php
```

**Via FTP:** Use FileZilla, Cyberduck, or your preferred FTP client

**Via cPanel:** Use File Manager > Upload

## Step 2: Set Permissions (1 minute)

```bash
# SSH into your server, then:
cd /path/to/your/website
chmod 755 submit-lead.php
mkdir leads
chmod 755 leads
```

**Or via cPanel:** Right-click files > Change Permissions > Set to 755

## Step 3: Configure Email (1 minute)

Edit `submit-lead.php` line 102:

```php
$to = 'your-email@constructioncapital.co.uk';  // Change this!
```

## Step 4: Test (1 minute)

1. Visit your website: `https://constructioncapital.co.uk`
2. Click "Get Funding" button
3. Fill out the form
4. Submit
5. Check `leads/leads.csv` for your test entry

## Done! 🎉

Your website is now live and capturing leads!

---

## Quick Troubleshooting

**Form not submitting?**
- Check PHP is installed: Create a file `phpinfo.php` with `<?php phpinfo(); ?>` and visit it
- Check file permissions (775 for directories, 644 for files)
- Check server error logs

**Not receiving emails?**
- Verify email address in submit-lead.php
- Check spam folder
- Some shared hosting blocks mail() function - use SMTP plugin or external service

**Leads not saving?**
- Check leads/ directory exists
- Check write permissions on leads/ directory
- Check PHP error logs

---

## Alternative: No Backend Setup (Even Faster!)

Don't have PHP? Use Web3Forms:

1. Sign up free at [web3forms.com](https://web3forms.com)
2. Get your access key
3. Edit `index.html` line ~800, replace the fetch URL:
   ```javascript
   const response = await fetch('https://api.web3forms.com/submit', {
       method: 'POST',
       body: formData
   });
   ```
4. Add this inside your form in HTML:
   ```html
   <input type="hidden" name="access_key" value="YOUR_KEY_HERE">
   ```

Done! Leads will be emailed to you automatically.

---

## Getting Help

- 📧 Technical support: Check your hosting provider's documentation
- 📖 Full documentation: See README.md
- 🐛 Issues: Check file permissions and PHP error logs

## Next Steps

- [ ] Add Google Analytics
- [ ] Set up automated email responses
- [ ] Add SSL certificate (HTTPS)
- [ ] Configure backup system for leads
- [ ] Add cookie consent (if needed for GDPR)
- [ ] Set up regular CSV exports

---

**Website**: constructioncapital.co.uk
**Support**: info@constructioncapital.co.uk
