<?php

namespace App\Libraries\Emails;

class ContactNotificationEmail extends BaseEmail
{
    /**
     * Notify the studio that a new contact-form message has arrived.
     * Best-effort: the caller should not fail the submission if this returns false.
     */
    public function notify(array $contact): bool
    {
        $adminEmail = config('Email')->fromEmail;

        $name    = $this->cleanHeader((string) ($contact['name'] ?? ''));
        $email   = $this->cleanHeader((string) ($contact['email'] ?? ''));
        $message = nl2br(esc((string) ($contact['message'] ?? '')));

        $subject = $this->cleanHeader("Nuovo messaggio dal sito: {$name}");

        $content = "
            <div style='text-align: center; margin-bottom: 30px;'>
                <div style='display: inline-block; background-color: rgba(140, 155, 134, 0.1); color: {$this->brandSecondary}; padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Modulo Contatti</div>
            </div>
            <h2 class='h2-title' style='font-family: serif; color: {$this->brandPrimary}; margin-bottom: 20px; font-size: 24px; text-align: center;'>Nuovo messaggio ricevuto</h2>
            <div class='detail-box' style='background-color: rgba(45, 36, 34, 0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(45, 36, 34, 0.05);'>
                <p style='margin: 0 0 12px 0;'><strong>Nome:</strong> " . esc($name) . "</p>
                <p style='margin: 0 0 12px 0;'><strong>Email:</strong> " . esc($email) . "</p>
                <p style='margin: 0 0 6px 0;'><strong>Messaggio:</strong></p>
                <div style='font-size: 14px; color: {$this->brandContrast};'>{$message}</div>
            </div>
        ";

        $htmlMessage = $this->renderLayout($content);

        // Reply-To the sender so the studio can answer directly (sanitised).
        if ($email !== '') {
            $this->email->setReplyTo($email, $name);
        }

        return $this->send($adminEmail, $subject, $htmlMessage);
    }
}
