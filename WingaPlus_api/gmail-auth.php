<?php
require __DIR__ . '/vendor/autoload.php';

echo "=== Gmail API Authentication ===\n\n";

$client = new Google_Client();
$client->setApplicationName('WingaPro');
$client->setScopes([Google_Service_Gmail::GMAIL_SEND]);
$client->setAuthConfig(__DIR__ . '/storage/app/gmail-credentials.json');
$client->setAccessType('offline');
$client->setPrompt('select_account consent');

$tokenPath = __DIR__ . '/storage/app/gmail-token.json';

// Always force re-authentication to get fresh token
if (file_exists($tokenPath)) {
    echo "Found existing token file. Removing...\n";
    unlink($tokenPath);
}

// Generate the authentication URL
$authUrl = $client->createAuthUrl();
echo "\n";
echo "Step 1: Open this URL in your browser:\n";
echo "========================================\n";
echo "$authUrl\n";
echo "========================================\n\n";
echo "Step 2: Authorize the app and copy the code\n";
echo "Step 3: Paste the code here: ";

$authCode = trim(fgets(STDIN));

if (empty($authCode)) {
    die("Error: No code provided\n");
}

echo "\nExchanging code for token...\n";

try {
    // Exchange authorization code for an access token
    $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
    
    // Check if there was an error
    if (array_key_exists('error', $accessToken)) {
        die("Error: " . $accessToken['error_description'] . "\n");
    }
    
    // Save the token to a file
    if (!file_exists(dirname($tokenPath))) {
        mkdir(dirname($tokenPath), 0700, true);
    }
    
    file_put_contents($tokenPath, json_encode($accessToken));
    chmod($tokenPath, 0644);
    chown($tokenPath, 'www-data');
    chgrp($tokenPath, 'www-data');
    
    echo "\n✓ Token saved successfully!\n";
    echo "✓ File: $tokenPath\n";
    echo "✓ Token expires in: " . ($accessToken['expires_in'] / 60) . " minutes\n";
    echo "✓ Refresh token: " . (isset($accessToken['refresh_token']) ? 'YES' : 'NO') . "\n";
    echo "\n✓ Authentication complete! You can now send emails.\n";
    
} catch (Exception $e) {
    die("Exception: " . $e->getMessage() . "\n");
}
