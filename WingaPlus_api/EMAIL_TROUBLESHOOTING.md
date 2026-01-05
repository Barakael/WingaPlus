# Gmail API Email - Complete Guide

## What Happened?

### The Original Problem:
1. **Nov 29**: Gmail API token expired (tokens last 1 hour)
2. **Refresh token was revoked** by Google (happens after ~6 months or security changes)
3. **Emails failed** because the system couldn't authenticate with Gmail

### Why Tokens Get Revoked:
- Token is >6 months old
- Google detects suspicious activity
- OAuth app credentials changed in Google Console
- Too many tokens issued (Google limit: 50 per user per app)
- Manual revocation from Google account settings

## How to Prevent This:

### 1. Automatic Token Refresh (NOW ENABLED)
The updated `GmailApiTransport.php` now:
- ✓ Automatically refreshes expired access tokens
- ✓ Logs all auth attempts to Laravel logs
- ✓ Provides clear error messages

### 2. Monitor Token Health
Create a cron job to check token status:

```bash
# Add to crontab (crontab -e):
0 */6 * * * php /var/www/WingaPlus/WingaPlus_api/artisan tinker --execute="echo (file_exists(storage_path('app/gmail-token.json')) ? 'Token exists' : 'TOKEN MISSING!');" >> /var/log/gmail-token-check.log
```

### 3. Set Up Alerts
Add this to your monitoring:
```bash
# Check logs for Gmail errors
tail -f /var/www/WingaPlus/WingaPlus_api/storage/logs/laravel.log | grep "Gmail"
```

## How to Re-authenticate (When Needed):

### Step 1: Run the auth script
```bash
php /var/www/WingaPlus/WingaPlus_api/gmail-auth.php
```

### Step 2: Follow the prompts
1. Open the URL in your browser
2. Sign in with: Wingaproapp@gmail.com
3. Allow permissions
4. Copy the code
5. Paste it back in terminal

### Step 3: Verify
```bash
php artisan tinker --execute="Mail::raw('Test', function(\$m) { \$m->to('your@email.com')->subject('Test'); });"
```

## Current Setup:

- **Credentials**: `storage/app/gmail-credentials.json` ✓
- **Token**: `storage/app/gmail-token.json` (needs re-auth)
- **Transport**: Gmail API (bypasses blocked SMTP ports) ✓
- **Auto-refresh**: Enabled ✓

## Resend Failed Emails:

After re-authentication:
```bash
php /tmp/resend_emails.php
```

This will send 6 warranty emails that failed Dec 6-9.

## Signs You Need to Re-authenticate:

Watch for these errors in logs:
- "Token has been expired or revoked"
- "invalid_grant"
- "Gmail token expired"

## Long-term Solution:

Consider using a service account (never expires) or:
- Use SendGrid/Mailgun for production
- Set up monitoring alerts
- Keep OAuth app credentials secure
