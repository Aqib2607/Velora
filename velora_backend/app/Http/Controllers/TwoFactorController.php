<?php

namespace App\Http\Controllers;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends BaseController
{
    public function enable(Request $request)
    {
        $user = $request->user();

        $google2fa = new Google2FA;
        $secret = $google2fa->generateSecretKey();

        // Encrypt secret before saving? Usually yes, but for simplicity here plain text or encrypted cast in model.
        // Laravel Fortify encrypts it. Let's store plain for now or encrypt manually if needed.
        // Assuming strict security not requested yet, but best practice is encrypt.
        // We will store it encrypted.
        $user->forceFill([
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => encrypt(json_encode(\Illuminate\Support\Collection::times(8, function () {
                return \Illuminate\Support\Str::random(10).'-'.\Illuminate\Support\Str::random(10);
            })->all())),
        ])->save();

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        // Generate SVG
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd
        );
        $writer = new Writer($renderer);
        $svgStart = strpos($writer->writeString($qrCodeUrl), '<svg');
        $svg = substr($writer->writeString($qrCodeUrl), $svgStart);

        return $this->success('2FA setup initiated', [
            'secret' => $secret,
            'qr_code' => $svg, // Or URL if prefer image tag
            'recovery_codes' => json_decode(decrypt($user->two_factor_recovery_codes)),
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $user = $request->user();

        if (! $user->two_factor_secret) {
            return $this->error('2FA not initialized.', 400);
        }

        $google2fa = new Google2FA;
        $secret = decrypt($user->two_factor_secret);

        if (! $google2fa->verifyKey($secret, $request->code)) {
            throw ValidationException::withMessages([
                'code' => ['The provided two-factor authentication code was invalid.'],
            ]);
        }

        $user->forceFill([
            'two_factor_confirmed_at' => now(),
        ])->save();

        return $this->success('Two-factor authentication enabled successfully.');
    }

    public function disable(Request $request)
    {
        $request->validate(['password' => 'required']);

        $user = $request->user();

        if (! \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password does not match your current password.'],
            ]);
        }

        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return $this->success('Two-factor authentication disabled.');
    }
}
