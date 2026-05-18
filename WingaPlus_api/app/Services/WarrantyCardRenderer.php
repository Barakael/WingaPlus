<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class WarrantyCardRenderer
{
    /**
     * Render a warranty card PNG and return it as data URI.
     *
     * @param array<string, mixed> $data
     */
    public function renderDataUri(array $data): string
    {
        $image = imagecreatetruecolor(1300, 1850);
        imageantialias($image, true);

        $blue = imagecolorallocate($image, 7, 35, 95);
        $primary = imagecolorallocate($image, 13, 77, 176);
        $text = imagecolorallocate($image, 18, 18, 18);
        $muted = imagecolorallocate($image, 86, 90, 98);
        $white = imagecolorallocate($image, 255, 255, 255);
        $grayBg = imagecolorallocate($image, 246, 248, 252);
        $border = imagecolorallocate($image, 220, 226, 236);

        imagefilledrectangle($image, 0, 0, 1300, 1850, $blue);
        imagefilledrectangle($image, 0, 260, 1300, 1780, $white);

        $this->drawCentered($image, 5, 65, '[User logo]', $white);
        $this->drawCentered($image, 5, 160, $this->normalize($data['business_name'] ?? 'Winga'), $white);

        imagestring($image, 4, 60, 325, 'Dear '.$this->normalize($data['customer_name'] ?? 'Customer').',', $text);
        imagestring($image, 5, 60, 385, 'Your Warranty is ', $text);
        imagestring($image, 5, 500, 385, 'Now Active!', $primary);
        imagestring(
            $image,
            4,
            60,
            450,
            'Thank you for purchasing from '.$this->normalize($data['business_name'] ?? 'our store').'.',
            $muted
        );
        imagestring($image, 4, 60, 490, 'Your warranty has been successfully registered.', $muted);

        imagefilledrectangle($image, 50, 555, 1250, 1570, $white);
        imagerectangle($image, 50, 555, 1250, 1570, $border);
        $this->drawCentered($image, 5, 590, 'WARRANTY DETAILS', $primary);
        imageline($image, 90, 650, 1210, 650, $border);
        imageline($image, 650, 660, 650, 1185, $border);

        $leftX = 110;
        $rightX = 700;

        $this->drawLabelValue($image, $leftX, 700, 'Phone Type', $data['product_name'] ?? 'N/A', $text, $primary);
        $this->drawLabelValue($image, $rightX, 700, 'Purchase Date', $data['purchase_date'] ?? 'N/A', $text, $primary);
        imageline($image, 90, 780, 610, 780, $border);
        imageline($image, 680, 780, 1210, 780, $border);

        $this->drawLabelValue($image, $leftX, 820, 'IMEI / Serial Number', $data['imei_serial'] ?? 'N/A', $text, $primary);
        $this->drawLabelValue($image, $rightX, 820, 'Warranty Period', $data['warranty_period'] ?? 'N/A', $text, $primary);
        imageline($image, 90, 900, 610, 900, $border);
        imageline($image, 680, 900, 1210, 900, $border);

        $this->drawLabelValue($image, $leftX, 940, 'Phone specification', $data['specification'] ?? 'N/A', $text, $primary);
        $this->drawLabelValue($image, $rightX, 940, 'Warranty Expires', $data['warranty_expires'] ?? 'N/A', $text, $primary);

        imagefilledrectangle($image, 80, 1045, 1220, 1430, $grayBg);
        imagerectangle($image, 80, 1045, 1220, 1430, $border);
        $this->drawCentered($image, 5, 1080, 'WARRANTY TERMS & CONDITIONS', $primary);

        $terms = [
            'This warranty covers manufacturing defects under normal use.',
            'Damage caused by accidents, water, or unauthorized repairs is excluded.',
            'Keep this card/email as proof for warranty validation.',
            'Warranty is valid only for original purchaser and is non-transferable.',
        ];
        $lineY = 1140;
        foreach ($terms as $term) {
            imagestring($image, 3, 110, $lineY, '- '.$term, $muted);
            $lineY += 48;
        }

        imagefilledrectangle($image, 50, 1570, 1250, 1770, $primary);
        imagestring($image, 5, 80, 1620, 'Need Any Help?', $white);
        imagestring($image, 3, 80, 1660, 'Contact our support team, we are here to help.', $white);
        imagestring(
            $image,
            4,
            760,
            1620,
            $this->normalize($data['business_phone'] ?? 'Phone not set'),
            $white
        );
        imagestring(
            $image,
            4,
            760,
            1670,
            $this->normalize($data['business_email'] ?? 'Email not set'),
            $white
        );

        $this->drawLogo($image, $data['logo_path'] ?? null);

        ob_start();
        imagepng($image);
        $binary = (string) ob_get_clean();
        imagedestroy($image);

        return 'data:image/png;base64,'.base64_encode($binary);
    }

    private function drawCentered(\GdImage $image, int $font, int $y, string $text, int $color): void
    {
        $width = imagefontwidth($font) * strlen($text);
        $x = (1300 - $width) / 2;
        imagestring($image, $font, (int) max(20, $x), $y, $text, $color);
    }

    private function drawLabelValue(
        \GdImage $image,
        int $x,
        int $y,
        string $label,
        ?string $value,
        int $labelColor,
        int $valueColor
    ): void {
        imagestring($image, 5, $x, $y, $label, $labelColor);
        imagestring($image, 4, $x, $y + 40, $this->normalize($value ?? 'N/A'), $valueColor);
    }

    private function drawLogo(\GdImage $image, ?string $logoPath): void
    {
        if (!$logoPath) {
            return;
        }

        $disk = Storage::disk('public');
        if (!$disk->exists($logoPath)) {
            return;
        }

        $binary = $disk->get($logoPath);
        $logo = @imagecreatefromstring($binary);
        if (!$logo) {
            return;
        }

        $maxWidth = 280;
        $maxHeight = 120;
        $srcW = imagesx($logo);
        $srcH = imagesy($logo);
        if ($srcW < 1 || $srcH < 1) {
            imagedestroy($logo);
            return;
        }

        $ratio = min($maxWidth / $srcW, $maxHeight / $srcH, 1);
        $dstW = (int) floor($srcW * $ratio);
        $dstH = (int) floor($srcH * $ratio);

        imagecopyresampled($image, $logo, (1300 - $dstW) / 2, 92, 0, 0, $dstW, $dstH, $srcW, $srcH);
        imagedestroy($logo);
    }

    private function normalize(?string $value): string
    {
        return trim((string) ($value ?? '')) ?: 'N/A';
    }
}
