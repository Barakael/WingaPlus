<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Sale;
use Illuminate\Support\Facades\Auth;

class WarrantySaleFiled extends Mailable
{
    use Queueable, SerializesModels;

    public $sale;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(Sale $sale)
    {
        $this->sale = $sale;
        $this->user = Auth::user();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $userName = $this->user ? $this->user->name : 'The Connect Store';
        return new Envelope(
            subject: "Warranty Filed by {$userName} - {$this->sale->product_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $userName = $this->user ? $this->user->name : 'The Connect Store';
        
        return new Content(
            view: 'emails.warranty_filed',
            with: [
                'sale' => $this->sale,
                'warrantyDetails' => $this->sale->warranty_details ?? [],
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
