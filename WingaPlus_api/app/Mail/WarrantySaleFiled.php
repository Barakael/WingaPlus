<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Sale;

class WarrantySaleFiled extends Mailable
{
    use Queueable, SerializesModels;

    public $sale;
    public $warranty;
    public $userName;

    /**
     * Create a new message instance.
     */
    public function __construct(Sale $sale, $warranty = null, $userName = null)
    {
        $this->sale = $sale;
        $this->warranty = $warranty;
        // Try to get the store name or full name from the salesman user
        if ($sale->salesman_id) {
            $user = \App\Models\User::find($sale->salesman_id);
            $this->userName = $user ? ($user->store_name ?: $user->name) : ($userName ?: 'WingaPlus');
        } else {
            $this->userName = $userName ?: 'WingaPlus';
        }
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $productName = $this->warranty ? $this->warranty->phone_name : $this->sale->product_name;
        
        return $this->subject("Warranty Filed by {$this->userName} - {$productName}")
                    ->view('emails.warranty_filed')
                    ->with('sale', $this->sale)
                    ->with('warranty', $this->warranty)
                    ->with('warrantyDetails', $this->sale->warranty_details ?? [])
                    ->with('userName', $this->userName);
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
