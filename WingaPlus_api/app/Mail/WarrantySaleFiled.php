<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Sale;
use App\Models\Shop;
use App\Models\User;
use App\Services\WarrantyCardRenderer;
use Carbon\Carbon;

class WarrantySaleFiled extends Mailable
{
    use Queueable, SerializesModels;

    public $sale;
    public $warranty;
    public $userName;
    public $issuerUser;

    /**
     * Create a new message instance.
     */
    public function __construct(Sale $sale, $warranty = null, $userName = null, ?User $issuerUser = null)
    {
        $this->sale = $sale;
        $this->warranty = $warranty;
        $this->issuerUser = $issuerUser;
        // Try to get the store name or full name from the salesman user
        if ($sale->salesman_id) {
            $user = \App\Models\User::find($sale->salesman_id);
            $this->userName = $user ? ($user->store_name ?: $user->name) : ($userName ?: 'WingaPro');
        } else {
            $this->userName = $userName ?: 'WingaPro';
        }
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $productName = $this->warranty ? $this->warranty->phone_name : $this->sale->product_name;
        $warrantyDetails = $this->sale->warranty_details ?? [];
        $issuerUser = $this->resolveIssuerUser();
        $issuerShop = $this->resolveIssuerShop($issuerUser);
        $cardRenderer = app(WarrantyCardRenderer::class);
        $cardImage = $cardRenderer->renderDataUri([
            'business_name' => $issuerShop?->name ?: $this->userName,
            'business_phone' => $issuerShop?->phone ?: ($issuerUser?->phone ?: $this->sale->customer_phone),
            'business_email' => $issuerShop?->effective_email ?: ($issuerUser?->email ?: null),
            'logo_path' => $this->resolveLogoPath($issuerUser, $issuerShop),
            'customer_name' => $this->sale->customer_name,
            'product_name' => $this->warranty?->phone_name ?: $this->sale->product_name,
            'purchase_date' => $this->formatDate($this->sale->created_at ?: now()),
            'warranty_period' => ($this->sale->warranty_months ?? ($this->warranty?->warranty_period ?? null)) ? (($this->sale->warranty_months ?? $this->warranty?->warranty_period).' months') : 'N/A',
            'warranty_expires' => $this->formatDate($this->sale->warranty_end ?? ($this->warranty?->expiry_date ?? null)),
            'imei_serial' => $warrantyDetails['imei_number'] ?? $this->sale->imei ?? $this->sale->serial_number ?? null,
            'specification' => $this->buildSpecification($warrantyDetails),
        ]);

        return $this->subject("Warranty Filed by {$this->userName} - {$productName}")
                    ->view('emails.warranty_filed')
                    ->with('sale', $this->sale)
                    ->with('warranty', $this->warranty)
                    ->with('warrantyDetails', $warrantyDetails)
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

    private function resolveIssuerUser(): ?User
    {
        $issuer = $this->issuerUser;
        if (!$issuer && $this->sale->salesman_id) {
            $issuer = User::with(['shop', 'ownedShop'])->find($this->sale->salesman_id);
        }

        return $issuer;
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

        // Role-based single logo priority:
        // - salesman: user logo first, then shop logo
        // - shop_owner: shop logo first, then user logo
        if ($issuer->role === 'salesman') {
            return $issuer->logo_path ?: $issuerShop?->logo_path;
        }
        if ($issuer->role === 'shop_owner') {
            return $issuerShop?->logo_path ?: $issuer->logo_path;
        }

        return $issuerShop?->logo_path ?: $issuer->logo_path;
    }

    /**
     * @param array<string, mixed> $warrantyDetails
     */
    private function buildSpecification(array $warrantyDetails): string
    {
        $pieces = array_filter([
            $warrantyDetails['storage'] ?? $this->sale->storage ?? null,
            $warrantyDetails['color'] ?? $this->sale->color ?? null,
            $warrantyDetails['ram'] ?? $this->sale->ram ?? null,
        ]);

        return $pieces ? implode(' | ', $pieces) : 'N/A';
    }

    private function formatDate($date): string
    {
        if (!$date) {
            return 'N/A';
        }

        return Carbon::parse($date)->format('M d, Y');
    }
}
