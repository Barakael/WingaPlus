<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Warranty Confirmation</title>
</head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff;border-radius:10px;padding:20px;">
        <p style="margin:0 0 10px 0;font-size:16px;">Dear {{ $sale->customer_name ?? 'Customer' }},</p>
        <p style="margin:0 0 18px 0;font-size:14px;line-height:1.5;">
            Your warranty has been activated successfully by {{ $userName }}.
            Please keep this email card for future warranty support.
        </p>

        <img
            src="{{ $cardImage }}"
            alt="Warranty Card"
            style="display:block;width:100%;max-width:700px;height:auto;margin:0 auto;border-radius:8px;border:1px solid #d1d5db;"
        />
    </div>
</body>
</html>
