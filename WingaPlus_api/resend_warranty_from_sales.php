<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Sale;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

echo "=== Resending Warranty Notification Emails from Sales ===\n\n";

// Get all sales with warranties
$salesWithWarranty = Sale::where('has_warranty', 1)
    ->orderBy('created_at', 'desc')
    ->get();

echo "Found " . $salesWithWarranty->count() . " sales with warranties\n\n";

if ($salesWithWarranty->isEmpty()) {
    echo "No sales with warranties found.\n";
    exit(0);
}

// Show what we found
echo "Preview of sales with warranties:\n";
echo "ID | Customer | Email | Product | Warranty End\n";
echo str_repeat("-", 100) . "\n";

foreach ($salesWithWarranty->take(5) as $sale) {
    $details = json_decode($sale->warranty_details, true);
    $email = $details['customer_email'] ?? 'NO EMAIL';
    $productName = $sale->phone_name ?? $sale->product_name;
    echo sprintf(
        "%d | %s | %s | %s | %s\n",
        $sale->id,
        substr($sale->customer_name, 0, 15),
        substr($email, 0, 25),
        substr($productName, 0, 20),
        $sale->warranty_end
    );
}

echo "\n";

// Ask user how many to resend
echo "How many warranty emails would you like to resend?\n";
echo "Enter number (1-" . $salesWithWarranty->count() . ") or 'all': ";
$input = trim(fgets(STDIN));

if (strtolower($input) === 'all') {
    $limit = $salesWithWarranty->count();
} elseif (!is_numeric($input) || $input <= 0) {
    echo "Invalid input. Exiting.\n";
    exit(0);
} else {
    $limit = min((int)$input, $salesWithWarranty->count());
}

echo "\n=== Resending $limit warranty emails ===\n\n";

$salesToResend = Sale::where('has_warranty', 1)
    ->orderBy('created_at', 'desc')
    ->limit($limit)
    ->get();

$successCount = 0;
$failCount = 0;
$noEmailCount = 0;

foreach ($salesToResend as $sale) {
    // Extract warranty details from JSON
    $details = json_decode($sale->warranty_details, true);
    
    if (!isset($details['customer_email']) || empty($details['customer_email'])) {
        echo "⚠️  Sale ID {$sale->id}: No customer email in warranty details\n";
        $noEmailCount++;
        continue;
    }

    $email = $details['customer_email'];
    $productName = $sale->phone_name ?? $sale->product_name;

    try {
        // Create a simple warranty notification email
        $subject = "Warranty Notification for {$productName}";
        $message = "Dear {$sale->customer_name},\n\n";
        $message .= "Your warranty for {$productName} has been registered.\n\n";
        $message .= "Warranty Details:\n";
        $message .= "- Product: {$productName}\n";
        $message .= "- Warranty Period: {$sale->warranty_months} months\n";
        $message .= "- Start Date: {$sale->warranty_start}\n";
        $message .= "- End Date: {$sale->warranty_end}\n";
        $message .= "- IMEI: " . ($details['imei_number'] ?? 'N/A') . "\n";
        $message .= "- Color: " . ($details['color'] ?? 'N/A') . "\n";
        $message .= "- Storage: " . ($details['storage'] ?? 'N/A') . "\n\n";
        $message .= "If you have any questions, please contact our support team.\n\n";
        $message .= "Best regards,\nWingaPlus Team";

        // Send using Laravel Mail
        Mail::raw($message, function ($mailable) use ($email, $subject) {
            $mailable->to($email)
                     ->subject($subject);
        });
        
        echo "✓ Sale ID {$sale->id}: Email sent to {$email} ({$sale->customer_name})\n";
        $successCount++;
    } catch (Exception $e) {
        echo "❌ Sale ID {$sale->id} ({$email}): " . $e->getMessage() . "\n";
        $failCount++;
        
        // Log the error
        Log::error("Warranty email resend failed for sale {$sale->id}: " . $e->getMessage());
    }
}

echo "\n=== Resend Results ===\n";
echo "✓ Successful: $successCount\n";
echo "❌ Failed: $failCount\n";
echo "⚠️  No Email: $noEmailCount\n";
echo "Total Processed: " . ($successCount + $failCount + $noEmailCount) . "\n";

if ($failCount > 0) {
    echo "\n⚠️  Check logs for error details: tail -50 storage/logs/laravel.log\n";
}
