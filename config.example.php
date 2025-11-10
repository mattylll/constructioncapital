<?php
/**
 * Configuration file for Construction Capital Website
 *
 * Copy this file to config.php and update with your settings
 */

// Email Configuration
define('NOTIFICATION_EMAIL', 'info@constructioncapital.co.uk');
define('FROM_EMAIL', 'noreply@constructioncapital.co.uk');
define('ENABLE_EMAIL_NOTIFICATIONS', true);

// Additional notification emails (comma-separated)
define('CC_EMAILS', ''); // e.g., 'john@example.com,jane@example.com'

// Lead Storage
define('LEADS_DIR', 'leads');
define('LEADS_FILE', 'leads.csv');

// Security Settings
define('ENABLE_HONEYPOT', true); // Add honeypot field for spam protection
define('RATE_LIMIT_ENABLED', true); // Limit submissions from same IP
define('RATE_LIMIT_MINUTES', 5); // Minutes between submissions from same IP

// Form Settings
define('REQUIRE_COMPANY', false); // Make company field required
define('REQUIRE_PROJECT_VALUE', false); // Make project value field required

// Redirect after submission (leave empty to show message in modal)
define('SUCCESS_REDIRECT_URL', '');

// Google reCAPTCHA (optional)
define('RECAPTCHA_ENABLED', false);
define('RECAPTCHA_SITE_KEY', '');
define('RECAPTCHA_SECRET_KEY', '');

// Webhooks (optional - send lead data to external services)
define('WEBHOOK_ENABLED', false);
define('WEBHOOK_URL', ''); // e.g., Zapier, Make.com webhook URL

// Slack notifications (optional)
define('SLACK_ENABLED', false);
define('SLACK_WEBHOOK_URL', '');

// Database storage (optional - requires MySQL)
define('DB_ENABLED', false);
define('DB_HOST', 'localhost');
define('DB_NAME', 'construction_capital');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_TABLE', 'leads');

// Debug mode (set to false in production)
define('DEBUG_MODE', false);

?>
