# Construction Capital Website

A professional website for Construction Capital (constructioncapital.co.uk) - Property Development Finance & Equity advisory services.

## Features

- **Clean, Modern Design**: Professional look with intuitive navigation
- **Modal Contact Forms**: Pop-up forms for lead generation
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Lead Capture System**: Automatic recording of all enquiries
- **Email Notifications**: Get notified instantly of new leads
- **CSV Export**: All leads saved in easy-to-read CSV format

## Setup Instructions

### Option 1: PHP Backend (Recommended)

This setup requires a web server with PHP support.

1. **Upload Files to Your Web Server**
   - Upload all files to your web hosting via FTP/SFTP
   - Ensure your hosting supports PHP 7.0 or higher

2. **Set Permissions**
   ```bash
   chmod 755 submit-lead.php
   mkdir leads
   chmod 755 leads
   ```

3. **Configure Email Notifications**
   - Edit `submit-lead.php`
   - Change the email address on line 102:
     ```php
     $to = 'your-email@constructioncapital.co.uk';
     ```

4. **Test the Form**
   - Open your website in a browser
   - Click "Get Funding" or "Discuss Your Project"
   - Fill out and submit the form
   - Check `leads/leads.csv` for the recorded data

### Option 2: Third-Party Form Service (No Backend Required)

If you don't have PHP hosting or prefer a managed solution:

#### Using Web3Forms (Free)

1. Sign up at [web3forms.com](https://web3forms.com)
2. Get your access key
3. In `index.html`, replace the `handleFormSubmit` function with:

```javascript
async function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = new FormData(event.target);
    formData.append('access_key', 'YOUR_ACCESS_KEY_HERE');

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
            event.target.reset();
            setTimeout(() => closeContactModal(), 3000);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'There was an error. Please email us at info@constructioncapital.co.uk';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';
    }
}
```

#### Using Formspree (Free tier available)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and get your form endpoint
3. Update the form action in `handleFormSubmit`:

```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json'
    }
});
```

### Option 3: Google Sheets Integration

Use Google Apps Script to save leads directly to a spreadsheet:

1. Create a Google Sheet for leads
2. Go to Extensions > Apps Script
3. Add this script:

```javascript
function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
        new Date(),
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.company,
        data.fundingType,
        data.projectValue,
        data.message
    ]);

    return ContentService
        .createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as web app and use the URL in your form submission

## File Structure

```
ConstructionCapital/
├── index.html              # Main website file
├── submit-lead.php         # PHP backend for lead capture
├── .htaccess              # Security and configuration
├── leads/                 # Lead storage directory
│   └── leads.csv         # CSV file with all leads
└── README.md             # This file
```

## Viewing Leads

### CSV File Method
- Leads are automatically saved to `leads/leads.csv`
- Download the file via FTP or access through your hosting control panel
- Open with Excel, Google Sheets, or any spreadsheet software
- Each row contains: timestamp, name, email, phone, company, funding type, project value, message, source, IP address

### Email Notifications
- You'll receive an email for each new lead
- Email includes all lead details
- Can be configured to send to multiple addresses

## Security Features

- HTTPS recommended for form submissions
- Input sanitization and validation
- CSRF protection considerations
- Email validation
- Protected leads directory
- IP address logging for tracking

## Customization

### Changing Colors
Edit the CSS in `index.html`:
- Primary color: `#0066cc` (blue)
- Hover color: `#0052a3` (darker blue)
- Background: `#f8f9fa` (light gray)

### Adding Form Fields
1. Add HTML field in the modal form
2. Update the `handleFormSubmit` function to include the new field
3. Update `submit-lead.php` to save the new field
4. Add column to CSV headers array

### Email Settings
Edit `submit-lead.php`:
- Line 102: Recipient email address
- Line 125: From email address
- Lines 104-120: Email content format

## Deployment

### Deploy to Your Server

1. **Via FTP/SFTP:**
   ```bash
   # Upload all files to your web root directory
   # Usually: /public_html/ or /www/ or /htdocs/
   ```

2. **Via cPanel File Manager:**
   - Login to cPanel
   - Navigate to File Manager
   - Upload files to public_html
   - Extract if needed

3. **Set Correct Permissions:**
   - Files: 644
   - Directories: 755
   - submit-lead.php: 755

### Domain Configuration

Point your domain (constructioncapital.co.uk) to your hosting:
- Update nameservers at your domain registrar
- Or set A record to your server's IP address
- Wait for DNS propagation (usually 24-48 hours)

## Testing

### Test Checklist
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Modal opens when clicking CTA buttons
- [ ] Form validation works (try submitting empty form)
- [ ] Form submission succeeds
- [ ] Lead appears in leads.csv
- [ ] Email notification arrives
- [ ] Mobile responsive design works
- [ ] All sections scroll smoothly

### Debug Mode
To test form submission locally:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Submit the form
4. Check for any JavaScript errors

## Support

For issues or questions:
- Email: info@constructioncapital.co.uk
- Check server error logs if form isn't working
- Ensure PHP version is 7.0+
- Verify file permissions are correct

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight CSS (no external dependencies)
- Vanilla JavaScript (no jQuery or frameworks)
- Fast loading times
- Optimized for Core Web Vitals

## Privacy & GDPR

Consider adding:
- Privacy policy page
- Cookie consent banner (if using analytics)
- Data retention policy
- GDPR-compliant lead handling

## Future Enhancements

Potential additions:
- Google Analytics integration
- Facebook Pixel tracking
- Live chat widget
- Case studies section
- Team profiles
- Blog/resources section
- Client testimonials

## License

© 2024 Construction Capital. All rights reserved.
