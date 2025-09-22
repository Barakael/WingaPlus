<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Warranty;
use Illuminate\Support\Facades\Auth;

class WarrantyFiled extends Mailable
{
    use Queueable, SerializesModels;

    public $warranty;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(Warranty $warranty)
    {
        $this->warranty = $warranty;
        $this->user = Auth::user();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $userName = $this->user ? $this->user->name : 'TheConnectStore';
        return new Envelope(
            subject: "Warranty Filed by {$userName} - {$this->warranty->phone_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $userName = $this->user ? $this->user->name : 'TheConnectStore';
        
        return new Content(
            view: 'emails.warranty_filed',
            with: [
                'warranty' => $this->warranty,
                'userName' => $userName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
