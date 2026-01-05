# Gmail API Email Setup - Complete

## What was done:

1. ✓ Created Gmail API Transport (`app/Mail/Transport/GmailApiTransport.php`)
2. ✓ Registered transport in AppServiceProvider
3. ✓ Updated `config/mail.php` to use `gmail-api` transport
4. ✓ Created authentication script (`gmail-auth.php`)
5. ✓ Created email resend script (`/tmp/resend_emails.php`)

## Current Status:

- Gmail API credentials exist at: `storage/app/gmail-credentials.json`
- Gmail token is **EXPIRED/REVOKED** and needs re-authentication
- 6 warranty emails are pending (Sale IDs: 49, 50, 52, 53, 54, 55)

## To Complete Setup:

### Step 1: Re-authenticate Gmail API

Run the following command:
```bash
php /var/www/WingaPlus/WingaPlus_api/gmail-auth.php
```

This will:
1. Generate an authentication URL
2. Ask you to open it in your browser
3. Prompt you to enter the verification code from Google

### Step 2: Resend Failed Emails

After authentication is successful, run:
```bash
php /tmp/resend_emails.php
```

This will send warranty notification emails to:
- clarahappy1993@gmail.com (Clara Happy - samsung s23 ultra)
- theeconnectstore@gmail.com (Customer 1 - 17 pro)
- abuuabby97@gmail.com (Customer 5 - iphone 17 pro max)
- abbyabby574@gmail.com (Customer 6 - iphone 15 pro max)
- barakaellucas2019@gmail.com (Barakael Lucas - iphone 15)
- abubakaryjambo@gmail.com (Customer 6 - samsung s25 ultra)

## How It Works Now:

- Emails are sent via Gmail API (not SMTP)
- No port restrictions (works even when ports 25, 465, 587 are blocked)
- Token refreshes automatically when expired
- If refresh fails, re-run `gmail-auth.php`

## Testing:

To test a single email, use:
```bash
php artisan tinker
Mail::to('test@example.com')->send(new App\Mail\TestMail());
```
