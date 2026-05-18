<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Shop;
use App\Models\User;
use App\Models\Warranty;
use App\Services\WarrantyCardRenderer;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class WarrantyFiled extends Mailable
{
    use Queueable, SerializesModels;

    public $warranty;
    public $sale;
    public $user;
    public $userName;
    public $warrantyDetails;
    public $issuerUser;

    /**
     * Create a new message instance.
     */
    public function __construct(Warranty $warranty, $sale = null, ?User $issuerUser = null)
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
        $this->issuerUser = $issuerUser ?: $this->user;
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
        $issuerShop = $this->resolveIssuerShop();
        $cardRenderer = app(WarrantyCardRenderer::class);
        $cardImage = $cardRenderer->renderDataUri([
            'business_name' => $issuerShop?->name ?: ($this->warranty->store_name ?: $this->userName),
            'business_phone' => $issuerShop?->phone ?: ($this->issuerUser?->phone ?: $this->warranty->customer_phone),
            'business_email' => $issuerShop?->effective_email ?: ($this->issuerUser?->email ?: null),
            'logo_path' => $issuerShop?->logo_path,
            'customer_name' => $this->sale->customer_name,
            'product_name' => $this->sale->product_name,
            'purchase_date' => $this->formatDate($this->sale->created_at),
            'warranty_period' => ($this->sale->warranty_months ?? null) ? ($this->sale->warranty_months.' months') : 'N/A',
            'warranty_expires' => $this->formatDate($this->sale->warranty_end),
            'imei_serial' => $this->warrantyDetails['imei_number'] ?? null,
            'specification' => implode(' | ', array_filter([$this->warrantyDetails['storage'] ?? null, $this->warrantyDetails['color'] ?? null])) ?: 'N/A',
        ]);

        return $this->subject("Warranty Filed by {$this->userName} - {$this->warranty->phone_name}")
                    ->view('emails.warranty_filed')
                    ->with('warranty', $this->warranty)
                    ->with('sale', $this->sale)
                    ->with('warrantyDetails', $this->warrantyDetails)
                    ->with('userName', $this->userName)
                    ->with('cardImage', $cardImage);
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

    private function resolveIssuerShop(): ?Shop
    {
        $issuer = $this->issuerUser;
        if (!$issuer) {
            return null;
        }

        if ($issuer->role === 'shop_owner') {
            return $issuer->ownedShop()->first();
        }

        if ($issuer->shop_id) {
            return $issuer->shop()->first();
        }

        return null;
    }

    private function formatDate($date): string
    {
        if (!$date) {
            return 'N/A';
        }

        return Carbon::parse($date)->format('M d, Y');
    }
}
