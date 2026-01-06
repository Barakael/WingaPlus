<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Str;

// Find storekeepers without email verification
$storekeepers = User::where('role', 'storekeeper')
    ->whereNull('email_verified_at')
    ->orderBy('created_at', 'desc')
    ->limit(5)
    ->get();

echo "Found " . $storekeepers->count() . " pending storekeeper invitations\n\n";

foreach ($storekeepers as $sk) {
    echo "ID: {$sk->id} | Name: {$sk->name} | Email: {$sk->email} | Shop ID: {$sk->shop_id}\n";
    echo "Created: {$sk->created_at}\n";
    
    // Generate new token if none exists
    if (!$sk->invitation_token) {
        $token = Str::random(60);
        $sk->update(['invitation_token' => $token]);
        echo "✓ New token generated!\n";
    } else {
        echo "Token already exists\n";
    }
    
    // Reload to get the updated token
    $sk->refresh();
    $link = "http://localhost:5173/setup-password/{$sk->invitation_token}";
    echo "Invitation Link: {$link}\n";
    echo "---\n\n";
}
