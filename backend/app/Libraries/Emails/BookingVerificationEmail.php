<?php

namespace App\Libraries\Emails;

class BookingVerificationEmail extends BaseEmail
{
    public function sendVerification(array $booking, string $title, \DateTime $startTime)
    {
        $confirmLink = "{$this->frontendUrl}/conferma-prenotazione/{$booking['confirmation_token']}";
        
        $content = "
            <h2 class='h2-title' style='font-family: serif; color: {$this->brandPrimary}; margin-bottom: 20px; font-size: 28px;'>Ciao {$booking['name']},</h2>
            <p class='text-base' style='font-size: 16px; line-height: 1.6; margin-bottom: 30px;'>
                Abbiamo ricevuto la tua richiesta di prenotazione per <strong>{$title}</strong>. 
                Per confermarla definitivamente, clicca sul pulsante qui sotto:
            </p>
            
            <div class='detail-box' style='background-color: rgba(184, 107, 90, 0.05); padding: 25px; border-radius: 20px; margin-bottom: 40px; border: 1px dashed {$this->brandPrimary};'>
                <div style='font-size: 14px; color: rgba(45, 36, 34, 0.6); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;'>Dettagli</div>
                <div class='text-base' style='font-size: 18px; font-weight: bold;'>{$startTime->format('d/m/Y')} alle ore {$startTime->format('H:i')}</div>
            </div>

            <div style='text-align: center;'>
                <a href='{$confirmLink}' class='btn-confirmation' style='display: inline-block; background-color: {$this->brandPrimary}; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(184, 107, 90, 0.2);'>Conferma Prenotazione</a>
            </div>
            
            <p class='text-base' style='font-size: 14px; color: rgba(45, 36, 34, 0.5); margin-top: 40px; text-align: center;'>
                Se non hai effettuato tu questa richiesta, puoi ignorare questa email.
            </p>
        ";

        $htmlMessage = $this->renderLayout($content);
        $subject = "Verifica la tua prenotazione - Stefania Mastroianni";

        return $this->send($booking['email'], $subject, $htmlMessage);
    }
}
