<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class WarrantyCardRenderer
{
    private const TEMPLATE_BASE_WIDTH = 682;
    private const TEMPLATE_BASE_HEIGHT = 1024;
    private const TEMPLATE_RENDER_SCALE = 2;

    /**
     * Render a warranty card PNG and return it as data URI.
     *
     * @param array<string, mixed> $data
     */
    public function renderDataUri(array $data): string
    {
        return 'data:image/png;base64,'.base64_encode($this->renderBinary($data));
    }

    /**
     * Render a warranty card PNG and return raw binary.
     *
     * @param array<string, mixed> $data
     */
    public function renderBinary(array $data): string
    {
        $templateImage = $this->loadTemplateImage();
        $image = $templateImage ?: $this->renderLegacyImage($data);
        if ($templateImage) {
            $image = $this->scaleTemplateForSharperOutput($image, self::TEMPLATE_RENDER_SCALE);
        }
        imageantialias($image, true);

        $textColor = imagecolorallocate($image, 22, 28, 38);
        $blue = imagecolorallocate($image, 20, 76, 168);
        $white = imagecolorallocate($image, 255, 255, 255);

        $width = imagesx($image);
        $height = imagesy($image);
        $sx = $width / self::TEMPLATE_BASE_WIDTH;
        $sy = $height / self::TEMPLATE_BASE_HEIGHT;

        $this->drawLogoOnTemplate($image, $data['logo_path'] ?? null, $sx, $sy);

        // Fine-tuned vertical alignment for template fields.
        $this->drawTemplateText($image, $this->normalize($data['customer_name'] ?? ''), 96, 184, 15, $textColor, $sx, $sy, 220);
        $this->drawTemplateText($image, $this->normalize($data['business_name'] ?? ''), 229, 286, 14, $textColor, $sx, $sy, 220);

        // Values are placed just below labels, matching the supplied template layout.
        $this->drawTemplateText($image, $this->normalize($data['product_name'] ?? ''), 109, 442, 13, $blue, $sx, $sy, 210);
        $this->drawTemplateText($image, $this->normalize($data['purchase_date'] ?? ''), 414, 442, 13, $blue, $sx, $sy, 185);
        $this->drawTemplateText($image, $this->normalize($data['imei_serial'] ?? ''), 109, 564, 13, $blue, $sx, $sy, 210);
        $this->drawTemplateText($image, $this->normalize($data['warranty_period'] ?? ''), 414, 564, 13, $blue, $sx, $sy, 185);
        $this->drawTemplateText($image, $this->normalize($data['specification'] ?? ''), 109, 696, 13, $blue, $sx, $sy, 210);
        $this->drawTemplateText($image, $this->normalize($data['warranty_expires'] ?? ''), 414, 696, 13, $blue, $sx, $sy, 185);

        $this->drawTemplateText($image, $this->normalize($data['business_phone'] ?? ''), 390, 933, 11, $white, $sx, $sy, 165);
        $this->drawTemplateText($image, $this->normalize($data['business_email'] ?? ''), 390, 955, 11, $white, $sx, $sy, 165);

        ob_start();
        imagepng($image);
        $binary = (string) ob_get_clean();
        imagedestroy($image);

        return $binary;
    }

    /**
     * Legacy fallback image (kept for safety if template is missing).
     *
     * @param array<string, mixed> $data
     */
    private function renderLegacyImage(array $data): \GdImage
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

        $this->drawLogoLegacy($image, $data['logo_path'] ?? null);
        return $image;
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

    private function drawLogoLegacy(\GdImage $image, ?string $logoPath): void
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

        $dstX = (int) floor((1300 - $dstW) / 2);
        imagecopyresampled($image, $logo, $dstX, 92, 0, 0, $dstW, $dstH, $srcW, $srcH);
        imagedestroy($logo);
    }

    private function loadTemplateImage(): ?\GdImage
    {
        $candidates = array_filter([
            env('WARRANTY_CARD_TEMPLATE_PATH'),
            base_path('../frontend/public/warranty.jpeg'),
            base_path('../frontend/public/warranty.jpg'),
            base_path('../frontend/public/warranty.png'),
            storage_path('app/public/email-templates/warranty-card-template.png'),
        ]);

        foreach ($candidates as $path) {
            if (!is_string($path) || $path === '' || !file_exists($path)) {
                continue;
            }

            $image = $this->createImageFromPath($path);
            if ($image instanceof \GdImage) {
                return $image;
            }
        }

        return null;
    }

    private function createImageFromPath(string $path): ?\GdImage
    {
        $ext = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));

        if ($ext === 'png') {
            $image = @imagecreatefrompng($path);
            return $image instanceof \GdImage ? $image : null;
        }

        if ($ext === 'jpg' || $ext === 'jpeg') {
            $image = @imagecreatefromjpeg($path);
            return $image instanceof \GdImage ? $image : null;
        }

        if ($ext === 'webp' && function_exists('imagecreatefromwebp')) {
            $image = @imagecreatefromwebp($path);
            return $image instanceof \GdImage ? $image : null;
        }

        // Fallback for unknown extensions.
        $raw = @file_get_contents($path);
        if ($raw === false) {
            return null;
        }

        $image = @imagecreatefromstring($raw);
        return $image instanceof \GdImage ? $image : null;
    }

    private function drawLogoOnTemplate(\GdImage $image, ?string $logoPath, float $sx, float $sy): void
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

        $srcW = imagesx($logo);
        $srcH = imagesy($logo);
        if ($srcW < 1 || $srcH < 1) {
            imagedestroy($logo);
            return;
        }

        $maxWidth = (int) floor(170 * $sx);
        $maxHeight = (int) floor(70 * $sy);
        $ratio = min($maxWidth / $srcW, $maxHeight / $srcH, 1);
        $dstW = max(1, (int) floor($srcW * $ratio));
        $dstH = max(1, (int) floor($srcH * $ratio));
        $dstX = (int) floor((imagesx($image) - $dstW) / 2);
        $dstY = (int) floor(54 * $sy);

        imagecopyresampled($image, $logo, $dstX, $dstY, 0, 0, $dstW, $dstH, $srcW, $srcH);
        imagedestroy($logo);
    }

    private function drawTemplateText(
        \GdImage $image,
        string $text,
        int $baseX,
        int $baseY,
        int $baseSize,
        int $color,
        float $sx,
        float $sy,
        ?int $baseMaxWidth = null
    ): void {
        if ($text === '' || $text === 'N/A') {
            return;
        }

        $fontPath = $this->resolveFontPath();
        $x = (int) floor($baseX * $sx);
        $y = (int) floor($baseY * $sy);

        if ($fontPath) {
            $size = max(11, (int) floor($baseSize * min($sx, $sy)));
            $maxWidth = $baseMaxWidth ? (int) floor($baseMaxWidth * $sx) : null;
            $renderText = $text;

            if ($maxWidth) {
                while ($size > 9 && $this->measureTextWidth($fontPath, $size, $renderText) > $maxWidth) {
                    $size--;
                }

                if ($this->measureTextWidth($fontPath, $size, $renderText) > $maxWidth) {
                    $renderText = $this->truncateToWidth($fontPath, $size, $renderText, $maxWidth);
                }
            }

            imagettftext($image, $size, 0, $x, $y, $color, $fontPath, $renderText);
            return;
        }

        imagestring($image, 3, $x, $y, $text, $color);
    }

    private function resolveFontPath(): ?string
    {
        $candidates = [
            resource_path('fonts/DejaVuSans.ttf'),
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
            '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
            '/Library/Fonts/Arial.ttf',
            '/System/Library/Fonts/Supplemental/Arial.ttf',
        ];

        foreach ($candidates as $path) {
            if (is_file($path)) {
                return $path;
            }
        }

        return null;
    }

    private function normalize(?string $value): string
    {
        return trim((string) ($value ?? '')) ?: 'N/A';
    }

    private function scaleTemplateForSharperOutput(\GdImage $image, int $scale): \GdImage
    {
        if ($scale <= 1) {
            return $image;
        }

        $srcW = imagesx($image);
        $srcH = imagesy($image);
        $dstW = $srcW * $scale;
        $dstH = $srcH * $scale;

        $scaled = imagecreatetruecolor($dstW, $dstH);
        imagealphablending($scaled, true);
        imagesavealpha($scaled, true);
        imagecopyresampled($scaled, $image, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);
        imagedestroy($image);

        return $scaled;
    }

    private function measureTextWidth(string $fontPath, int $size, string $text): int
    {
        $box = imagettfbbox($size, 0, $fontPath, $text);
        if (!$box) {
            return 0;
        }

        return (int) abs($box[2] - $box[0]);
    }

    private function truncateToWidth(string $fontPath, int $size, string $text, int $maxWidth): string
    {
        $ellipsis = '...';
        $trimmed = $text;

        while (mb_strlen($trimmed) > 1) {
            $candidate = rtrim(mb_substr($trimmed, 0, -1)).$ellipsis;
            if ($this->measureTextWidth($fontPath, $size, $candidate) <= $maxWidth) {
                return $candidate;
            }
            $trimmed = mb_substr($trimmed, 0, -1);
        }

        return $ellipsis;
    }
}
