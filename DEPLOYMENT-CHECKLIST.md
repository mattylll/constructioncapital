# Deployment Checklist for Construction Capital Website

Use this checklist to ensure a smooth deployment to constructioncapital.co.uk

## Pre-Deployment

### Domain & Hosting
- [ ] Domain registered: constructioncapital.co.uk
- [ ] Web hosting account set up with PHP 7.0+ support
- [ ] Domain DNS pointed to hosting (allow 24-48h for propagation)
- [ ] SSL certificate installed (HTTPS enabled)
- [ ] FTP/SFTP credentials obtained
- [ ] cPanel or hosting dashboard access confirmed

### Email Setup
- [ ] Business email created: info@constructioncapital.co.uk
- [ ] Email tested and receiving messages
- [ ] Auto-responder configured (optional)

## Deployment Steps

### 1. Upload Files
- [ ] All website files uploaded to web root (/public_html/ or /www/)
- [ ] Files uploaded in correct structure (not in subdirectory)
- [ ] Hidden files (.htaccess, .gitignore) uploaded

### 2. File Permissions
- [ ] submit-lead.php set to 755 or 644
- [ ] leads/ directory created with 755 permissions
- [ ] .htaccess file set to 644
- [ ] index.html set to 644

### 3. Configuration
- [ ] Email address updated in submit-lead.php (line 102)
- [ ] From email updated in submit-lead.php (line 125)
- [ ] Email notifications enabled (line 100 in submit-lead.php)
- [ ] Test email sent successfully

### 4. Security
- [ ] .htaccess file protecting leads/ directory
- [ ] Directory browsing disabled
- [ ] SSL/HTTPS enabled and redirecting from HTTP
- [ ] PHP version verified (7.0+)
- [ ] File upload restrictions in place

## Testing

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] All sections display properly
- [ ] Navigation links work
- [ ] Smooth scrolling functions
- [ ] "Get Funding" button opens modal
- [ ] Modal form displays correctly
- [ ] Form validation works (empty submission blocked)
- [ ] Form successfully submits
- [ ] Success message displays
- [ ] Modal closes after submission

### Lead Capture Tests
- [ ] Test lead appears in leads/leads.csv
- [ ] CSV file is properly formatted
- [ ] Email notification received
- [ ] Email contains all form data
- [ ] Reply-to address is correct
- [ ] Timestamp is accurate

### Browser Tests
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

### Responsive Design Tests
- [ ] Mobile phone (portrait)
- [ ] Mobile phone (landscape)
- [ ] Tablet (portrait)
- [ ] Tablet (landscape)
- [ ] Desktop (1920x1080)
- [ ] Desktop (1366x768)

### Performance Tests
- [ ] Page loads in under 3 seconds
- [ ] Images load properly
- [ ] No JavaScript errors in console
- [ ] No CSS rendering issues

## Post-Deployment

### Analytics & Tracking
- [ ] Google Analytics installed (optional)
- [ ] Google Search Console set up
- [ ] Facebook Pixel added (optional)
- [ ] LinkedIn Insight Tag added (optional)

### SEO Optimization
- [ ] Meta descriptions added
- [ ] Open Graph tags added for social sharing
- [ ] Sitemap.xml created and submitted
- [ ] robots.txt configured
- [ ] Google My Business listing claimed
- [ ] Schema markup added (optional)

### Marketing
- [ ] Website announced on social media
- [ ] Email signature updated with website link
- [ ] Business cards updated
- [ ] Letterhead updated

### Maintenance Setup
- [ ] Automatic backups configured
- [ ] leads.csv backup schedule created
- [ ] Website monitoring service enabled (e.g., UptimeRobot)
- [ ] Security scanning enabled
- [ ] Regular update schedule planned

## Legal & Compliance

### Required Pages (Create if needed)
- [ ] Privacy Policy page
- [ ] Cookie Policy page
- [ ] Terms & Conditions page
- [ ] GDPR compliance statement

### GDPR Compliance
- [ ] Cookie consent banner added (if using cookies)
- [ ] Privacy policy links in footer
- [ ] Lead data retention policy defined
- [ ] Data deletion process documented
- [ ] User rights information provided

## Weekly Maintenance

- [ ] Download and backup leads.csv
- [ ] Review and respond to all enquiries
- [ ] Check website is loading correctly
- [ ] Review analytics data
- [ ] Test form submission

## Monthly Maintenance

- [ ] Update PHP if needed
- [ ] Check SSL certificate expiry
- [ ] Review server logs for errors
- [ ] Test all forms and functionality
- [ ] Review and update content as needed
- [ ] Check for broken links
- [ ] Export leads to CRM/backup location

## Emergency Contacts

| Issue | Contact |
|-------|---------|
| Website down | Your hosting support |
| Email issues | Your email hosting support |
| Domain issues | Your domain registrar |
| Development issues | Your web developer |

## Rollback Plan

If something goes wrong:

1. **Keep backup of old site** before deploying new one
2. **Document current server configuration**
3. **Have FTP access ready** to quickly revert files
4. **Test in staging environment** first if possible

### Quick Rollback Steps:
```bash
# Rename current site
mv public_html public_html_new

# Restore backup
mv public_html_backup public_html

# Or upload backup files via FTP
```

## Success Criteria

Your deployment is successful when:

- ✅ Website loads on constructioncapital.co.uk
- ✅ HTTPS is working (green padlock)
- ✅ All forms submit successfully
- ✅ Leads are recorded in CSV
- ✅ Email notifications arrive
- ✅ Mobile version looks great
- ✅ No console errors
- ✅ All links work

## Notes & Issues

Use this space to document any issues or custom configurations:

---
**Deployment Date:** _______________
**Deployed By:** _______________
**Hosting Provider:** _______________
**SSL Certificate Expires:** _______________
**Next Review Date:** _______________

---

## Support Resources

- **Full Documentation:** README.md
- **Quick Start:** QUICKSTART.md
- **PHP Documentation:** https://php.net
- **Hosting Support:** Check your hosting provider's documentation
- **Email Support:** info@constructioncapital.co.uk

---

**Last Updated:** November 2024
