<?php

namespace App\Libraries;

/**
 * Minimal, dependency-free signed token helper for admin authentication.
 *
 * Tokens have the shape  base64url(payload).base64url(HMAC-SHA256(payload))
 * and carry an `exp` claim. They are verified with a constant-time signature
 * check, so — unlike the previous unsigned base64 token — they cannot be forged
 * client-side.
 */
class AuthTokens
{
    /** Token lifetime in seconds (24h). */
    private const TTL = 86400;

    /**
     * Issue a signed token for the given admin user.
     */
    public static function issue(string $user): string
    {
        $payload = [
            'user' => $user,
            'iat'  => time(),
            'exp'  => time() + self::TTL,
        ];

        $body = self::b64encode(json_encode($payload));

        return $body . '.' . self::sign($body);
    }

    /**
     * Validate a token. Returns the decoded payload when the signature is valid
     * and the token has not expired, otherwise null.
     *
     * @return array<string, mixed>|null
     */
    public static function validate(?string $token): ?array
    {
        if (! is_string($token) || substr_count($token, '.') !== 1) {
            return null;
        }

        [$body, $sig] = explode('.', $token, 2);

        if (! hash_equals(self::sign($body), $sig)) {
            return null;
        }

        $payload = json_decode(self::b64decode($body), true);

        if (! is_array($payload) || ! isset($payload['exp'])) {
            return null;
        }

        if (time() >= (int) $payload['exp']) {
            return null;
        }

        return $payload;
    }

    /**
     * The HMAC key. Prefers an explicit AUTH_SECRET env var; otherwise derives a
     * non-empty key from the admin credentials (which already must exist for
     * login). Deriving from the password means tokens auto-invalidate whenever
     * the admin password is rotated.
     */
    private static function secret(): string
    {
        $explicit = env('AUTH_SECRET');
        if (is_string($explicit) && $explicit !== '') {
            return $explicit;
        }

        $user = (string) (env('ADMIN_USERNAME') ?: 'admin');
        $pass = (string) (env('ADMIN_PASSWORD') ?: 'admin');

        return hash('sha256', 'arpelux|' . $user . '|' . $pass);
    }

    private static function sign(string $body): string
    {
        return self::b64encode(hash_hmac('sha256', $body, self::secret(), true));
    }

    private static function b64encode(string $raw): string
    {
        return rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    }

    private static function b64decode(string $enc): string
    {
        return (string) base64_decode(strtr($enc, '-_', '+/'));
    }
}
