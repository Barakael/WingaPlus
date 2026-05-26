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
        $issuerUser = $this->resolveIssuerUser();
        $issuerShop = $this->resolveIssuerShop($issuerUser);
        $replyToEmail = $this->resolveReplyToEmail($issuerUser, $issuerShop);
        $cardRenderer = app(WarrantyCardRenderer::class);
        $cardImage = $cardRenderer->renderDataUri([
            'business_name' => $issuerShop?->name ?: ($this->warranty->store_name ?: $this->userName),
            'business_phone' => $issuerShop?->phone ?: ($issuerUser?->phone ?: $this->warranty->customer_phone),
            'business_email' => $issuerShop?->effective_email ?: ($issuerUser?->email ?: null),
            'logo_path' => $this->resolveLogoPath($issuerUser, $issuerShop),
            'customer_name' => $this->sale->customer_name,
            'product_name' => $this->sale->product_name,
            'purchase_date' => $this->formatDate($this->sale->created_at),
            'warranty_period' => ($this->sale->warranty_months ?? null) ? ($this->sale->warranty_months.' months') : 'N/A',
            'warranty_expires' => $this->formatDate($this->sale->warranty_end),
            'imei_serial' => $this->warrantyDetails['imei_number'] ?? null,
            'specification' => implode(' | ', array_filter([$this->warrantyDetails['storage'] ?? null, $this->warrantyDetails['color'] ?? null])) ?: 'N/A',
        ]);
        $cardImageBinary = null;
        $cardImageName = 'warranty-card.png';
        try {
            $cardImageBinary = $cardRenderer->renderBinary([
                'business_name' => $issuerShop?->name ?: ($this->warranty->store_name ?: $this->userName),
                'business_phone' => $issuerShop?->phone ?: ($issuerUser?->phone ?: $this->warranty->customer_phone),
                'business_email' => $issuerShop?->effective_email ?: ($issuerUser?->email ?: null),
                'logo_path' => $this->resolveLogoPath($issuerUser, $issuerShop),
                'customer_name' => $this->sale->customer_name,
                'product_name' => $this->sale->product_name,
                'purchase_date' => $this->formatDate($this->sale->created_at),
                'warranty_period' => ($this->sale->warranty_months ?? null) ? ($this->sale->warranty_months.' months') : 'N/A',
                'warranty_expires' => $this->formatDate($this->sale->warranty_end),
                'imei_serial' => $this->warrantyDetails['imei_number'] ?? null,
                'specification' => implode(' | ', array_filter([$this->warrantyDetails['storage'] ?? null, $this->warrantyDetails['color'] ?? null])) ?: 'N/A',
            ]);
        } catch (\Throwable $e) {
            // Fallback to data URI when inline binary generation fails.
        }

        $mail = $this->subject("Warranty Filed by {$this->userName} - {$this->warranty->phone_name}")
            ->view('emails.warranty_filed')
            ->with('warranty', $this->warranty)
            ->with('sale', $this->sale)
            ->with('warrantyDetails', $this->warrantyDetails)
            ->with('userName', $this->userName)
            ->with('cardImage', $cardImage)
            ->with('cardImageBinary', $cardImageBinary)
            ->with('cardImageName', $cardImageName);

        if ($replyToEmail) {
            $mail->replyTo($replyToEmail, $this->userName);
        }

        return $mail;
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

    private function resolveIssuerUser(): ?User
    {
        return $this->issuerUser;
    }

    private function resolveIssuerShop(?User $issuer): ?Shop
    {
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

    private function resolveLogoPath(?User $issuer, ?Shop $issuerShop): ?string
    {
        if (!$issuer) {
            return $issuerShop?->logo_path;
        }

        if ($issuer->role === 'salesman') {
            return $issuer->logo_path ?: $issuerShop?->logo_path;
        }
        if ($issuer->role === 'shop_owner') {
            return $issuerShop?->logo_path ?: $issuer->logo_path;
        }

        return $issuerShop?->logo_path ?: $issuer->logo_path;
    }

    private function resolveReplyToEmail(?User $issuer, ?Shop $issuerShop): ?string
    {
        $shopEmail = $issuerShop?->effective_email;
        if ($shopEmail && filter_var($shopEmail, FILTER_VALIDATE_EMAIL)) {
            return $shopEmail;
        }

        $userEmail = $issuer?->email;
        if ($userEmail && filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
            return $userEmail;
        }

        $fallbackEmail = config('mail.reply_to.address');
        if ($fallbackEmail && filter_var($fallbackEmail, FILTER_VALIDATE_EMAIL)) {
            return $fallbackEmail;
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
