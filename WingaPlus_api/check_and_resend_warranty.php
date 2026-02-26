<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Warranty;
use App\Mail\WarrantyFiled;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

echo "=== Warranty Email Diagnostic & Resend Tool ===\n\n";

// Step 1: Read logs for failed warranty emails
echo "Step 1: Checking logs for failed warranty emails...\n";
$logFile = __DIR__ . '/storage/logs/laravel.log';

if (!file_exists($logFile)) {
    echo "❌ Log file not found: $logFile\n";
    exit(1);
}

$logContent = file_get_contents($logFile);
$failedEmails = [];

// Find warranty-related errors
if (strpos($logContent, 'Failed to send warranty email') !== false) {
    echo "✓ Found warranty email failures in logs\n";
    echo "✓ Most recent failures:\n";
    
    // Show last 20 lines with warranty errors
    $lines = explode("\n", $logContent);
    $count = 0;
    for ($i = count($lines) - 1; $i >= 0 && $count < 20; $i--) {
        if (strpos($lines[$i], 'Failed to send warranty email') !== false || 
            strpos($lines[$i], 'Gmail token') !== false) {
            echo "  " . trim($lines[$i]) . "\n";
            $count++;
        }
    }
} else {
    echo "✓ No recent warranty email failures found in logs\n";
}

echo "\n";

// Step 2: Check database for warranties
echo "Step 2: Checking database for warranties...\n";
$totalWarranties = \App\Models\Warranty::count();
echo "Total warranties in database: $totalWarranties\n";

if ($totalWarranties === 0) {
    echo "⚠️  No warranties found in database\n";
    exit(0);
}

$warranties = \App\Models\Warranty::orderBy('created_at', 'desc')->limit(10)->get();

echo "\nLatest 10 warranties:\n";
echo "ID | Customer Email | Phone | Created\n";
echo str_repeat("-", 80) . "\n";

foreach ($warranties as $w) {
    echo sprintf(
        "%d | %s | %s | %s\n",
        $w->id,
        $w->customer_email ?: 'NO EMAIL',
        $w->phone_name ?: 'Unknown',
        $w->created_at->format('Y-m-d H:i')
    );
}

echo "\n";

// Step 3: Ask if user wants to resend
echo "Step 3: Ready to resend warranty emails\n";
echo "Enter number of warranties to resend (from most recent): ";
$input = trim(fgets(STDIN));

if (!is_numeric($input) || $input <= 0) {
    echo "Invalid input. Exiting.\n";
    exit(0);
}

$limit = (int)$input;
$warrantiesToResend = \App\Models\Warranty::orderBy('created_at', 'desc')->limit($limit)->get();

echo "\n=== Resending $limit warranty emails ===\n\n";

$successCount = 0;
$failCount = 0;

foreach ($warrantiesToResend as $warranty) {
    if (!$warranty->customer_email) {
        echo "❌ Warranty ID {$warranty->id}: No customer email\n";
        $failCount++;
        continue;
    }

    try {
        Mail::to($warranty->customer_email)
            ->send(new WarrantyFiled($warranty));
        
        echo "✓ Warranty ID {$warranty->id}: Email sent to {$warranty->customer_email} ({$warranty->customer_name})\n";
        $successCount++;
    } catch (Exception $e) {
        echo "❌ Warranty ID {$warranty->id} ({$warranty->customer_email}): " . $e->getMessage() . "\n";
        $failCount++;
        
        // Log the error
        Log::error("Warranty email resend failed for warranty {$warranty->id}: " . $e->getMessage());
    }
}

echo "\n=== Resend Results ===\n";
echo "✓ Successful: $successCount\n";
echo "❌ Failed: $failCount\n";
echo "Total: " . ($successCount + $failCount) . "\n";

if ($failCount > 0) {
    echo "\n⚠️  Check logs for error details: tail -f storage/logs/laravel.log\n";
}
