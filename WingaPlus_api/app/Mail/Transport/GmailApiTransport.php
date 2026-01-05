<?php

namespace App\Mail\Transport;

use Google_Client;
use Google_Service_Gmail;
use Google_Service_Gmail_Message;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\TransportInterface;
use Symfony\Component\Mime\MessageConverter;
use Illuminate\Support\Facades\Log;

class GmailApiTransport implements TransportInterface
{
    protected $client;
    protected $service;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setApplicationName('WingaPro');
        $this->client->setScopes([Google_Service_Gmail::GMAIL_SEND]);
        $this->client->setAuthConfig(storage_path('app/gmail-credentials.json'));
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

        $tokenPath = storage_path('app/gmail-token.json');
        
        if (!file_exists($tokenPath)) {
            throw new \Exception('Gmail token file not found. Please run: php gmail-auth.php');
        }
        
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $this->client->setAccessToken($accessToken);

        // Check if token is expired and try to refresh
        if ($this->client->isAccessTokenExpired()) {
            Log::info('Gmail API token expired, attempting refresh');
            
            if ($this->client->getRefreshToken()) {
                try {
                    $newToken = $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    
                    if (isset($newToken['error'])) {
                        Log::error('Gmail token refresh failed: ' . $newToken['error_description']);
                        throw new \Exception('Gmail token expired. Please run: php gmail-auth.php');
                    }
                    
                    // Merge and save new token
                    $accessToken = array_merge($accessToken, $newToken);
                    file_put_contents($tokenPath, json_encode($accessToken));
                    $this->client->setAccessToken($accessToken);
                    Log::info('Gmail API token refreshed successfully');
                    
                } catch (\Exception $e) {
                    Log::error('Gmail token refresh exception: ' . $e->getMessage());
                    throw new \Exception('Gmail token expired. Please run: php gmail-auth.php');
                }
            } else {
                Log::error('No refresh token available');
                throw new \Exception('Gmail token expired and no refresh token. Please run: php gmail-auth.php');
            }
        }

        $this->service = new Google_Service_Gmail($this->client);
    }

    public function send(\Symfony\Component\Mime\RawMessage $message, \Symfony\Component\Mailer\Envelope $envelope = null): ?SentMessage
    {
        $email = MessageConverter::toEmail($message);
        
        $strRawMessage = $email->toString();
        $rawMessage = strtr(base64_encode($strRawMessage), array('+' => '-', '/' => '_'));
        
        $gmailMessage = new Google_Service_Gmail_Message();
        $gmailMessage->setRaw($rawMessage);
        
        try {
            $result = $this->service->users_messages->send('me', $gmailMessage);
            Log::info('Gmail API email sent successfully', ['message_id' => $result->getId()]);
            return new SentMessage($message, $envelope ?? \Symfony\Component\Mailer\Envelope::create($message));
        } catch (\Exception $e) {
            Log::error('Gmail API send failed: ' . $e->getMessage());
            throw new \Exception('Gmail API Error: ' . $e->getMessage());
        }
    }

    public function __toString(): string
    {
        return 'gmail-api';
    }
}
