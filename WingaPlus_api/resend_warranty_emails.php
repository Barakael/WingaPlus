<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Warranty;
use App\Mail\WarrantyFiled;
use Illuminate\Support\Facades\Mail;

echo "=== Resending Warranty Emails ===\n\n";

// Get all warranties (or filter by recent ones)
$warranties = Warranty::orderBy('created_at', 'desc')->get();

if ($warranties->isEmpty()) {
    echo "No warranties found.\n";
    exit(0);
}

echo "Found " . $warranties->count() . " warranties total\n";
echo "Attempting to resend warranty notification emails...\n\n";

$successCount = 0;
$failCount = 0;

foreach ($warranties as $warranty) {
    if (!$warranty->customer_email) {
        echo "❌ Warranty ID {$warranty->id}: No customer email\n";
        $failCount++;
        continue;
    }

    try {
        Mail::to($warranty->customer_email)
            ->send(new WarrantyFiled($warranty));
        
        echo "✓ Warranty ID {$warranty->id}: Email sent to {$warranty->customer_email}\n";
        $successCount++;
    } catch (Exception $e) {
        echo "❌ Warranty ID {$warranty->id}: {$e->getMessage()}\n";
        $failCount++;
    }
}

echo "\n=== Results ===\n";
echo "✓ Successful: $successCount\n";
echo "❌ Failed: $failCount\n";
echo "Total: " . ($successCount + $failCount) . "\n";
