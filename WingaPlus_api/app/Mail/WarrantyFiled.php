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
    public $sale;
    public $user;
    public $userName;
    public $warrantyDetails;

    /**
     * Create a new message instance.
     */
    public function __construct(Warranty $warranty, $sale = null)
    {
        $this->warranty = $warranty;
        $this->sale = $sale ?? (object) [
            'customer_name' => $warranty->customer_name,
            'product_name' => $warranty->phone_name,
            'created_at' => $warranty->created_at,
            'warranty_months' => $warranty->warranty_period,
            'warranty_end' => $warranty->expiry_date,
        ];
        $this->user = Auth::user();
        $this->userName = $this->user ? $this->user->name : 'The Connect Store';
        $this->warrantyDetails = [
            'imei_number' => $this->warranty->imei_number,
            'color' => $this->warranty->color,
            'storage' => $this->warranty->storage,
        ];
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject("Warranty Filed by {$this->userName} - {$this->warranty->phone_name}")
                    ->view('emails.warranty_filed')
                    ->with('warranty', $this->warranty)
                    ->with('sale', $this->sale)
                    ->with('warrantyDetails', $this->warrantyDetails)
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
