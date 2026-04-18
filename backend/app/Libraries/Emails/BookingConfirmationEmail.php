<?php

namespace App\Libraries\Emails;

class BookingConfirmationEmail extends BaseEmail
{
    public function sendConfirmation(array $booking, string $title, \DateTime $startTime, array $settings)
    {
        $cancelLink = "{$this->frontendUrl}/cancella-prenotazione/{$booking['cancellation_token']}";
        
        $notesHtml = $booking['notes'] ? "
            <tr>
                <td colspan='2' style='padding-top: 15px; border-top: 1px solid rgba(45, 36, 34, 0.05);'>
                    <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Le tue note</div>
                    <div style='font-size: 14px; font-style: italic; color: rgba(45, 36, 34, 0.7);'>{$booking['notes']}</div>
                </td>
            </tr>" : "";

        $content = "
            <div style='text-align: center; margin-bottom: 30px;'>
                <div style='display: inline-block; background-color: rgba(140, 155, 134, 0.1); color: {$this->brandSecondary}; padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Confermata</div>
            </div>
            <h2 class='h2-title' style='font-family: serif; color: {$this->brandPrimary}; margin-bottom: 20px; font-size: 28px; text-align: center;'>Tutto pronto!</h2>
            <p class='text-base' style='font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;'>
                La tua prenotazione per <strong>{$title}</strong> è stata confermata correttamente. 
                Non vediamo l'ora di vederti!
            </p>
            
            <div class='detail-box' style='background-color: rgba(184, 107, 90, 0.03); padding: 30px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(184, 107, 90, 0.1);'>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding-bottom: 15px;'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Appuntamento</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$title}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding-bottom: 15px;'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Giorno</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$startTime->format('d/m/Y')}</div>
                        </td>
                        <td style='padding-bottom: 15px;'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Orario</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$startTime->format('H:i')}</div>
                        </td>
                    </tr>
                    {$notesHtml}
                </table>
            </div>
            
            <div style='text-align: center; margin-top: 30px;'>
                <p class='text-base' style='font-size: 13px; color: rgba(45, 36, 34, 0.5);'>
                    Hai bisogno di cancellare? Puoi farlo <a href='{$cancelLink}' style='color: {$this->brandPrimary};'>qui</a> fino a {$settings['cancellation_limit_days']} giorni prima.
                </p>
            </div>
        ";

        $htmlMessage = $this->renderLayout($content);
        return $this->send($booking['email'], "Prenotazione Confermata - Stefania Mastroianni", $htmlMessage);
    }

    public function notifyAdmin(array $booking, string $title, \DateTime $startTime)
    {
        $adminEmail = config('Email')->fromEmail;
        $subject = "Nuova Prenotazione: {$booking['name']} - {$title}";

        $content = "
            <div style='text-align: center; margin-bottom: 30px;'>
                <div style='display: inline-block; background-color: rgba(140, 155, 134, 0.1); color: {$this->brandSecondary}; padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Notifica Amministratore</div>
            </div>
            
            <h2 class='h2-title' style='font-family: serif; color: {$this->brandPrimary}; margin-bottom: 20px; font-size: 24px; text-align: center;'>Nuova Prenotazione Ricevuta</h2>
            
            <div class='detail-box' style='background-color: rgba(45, 36, 34, 0.02); padding: 30px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(45, 36, 34, 0.05);'>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding-bottom: 15px; border-bottom: 1px solid rgba(45, 36, 34, 0.05);'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Cliente</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$booking['name']}</div>
                            <div style='font-size: 14px; color: rgba(45, 36, 34, 0.6);'>{$booking['email']}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding-top: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(45, 36, 34, 0.05);'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Servizio / Evento</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$title}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding-top: 15px; padding-bottom: 15px;'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Data e Ora</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$startTime->format('d/m/Y')} alle {$startTime->format('H:i')}</div>
                        </td>
                    </tr>
                </table>
            </div>

            " . ($booking['notes'] ? "
            <div style='padding: 20px; background-color: #fff; border-left: 4px solid {$this->brandPrimary}; margin-top: 10px;'>
                <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Note del cliente</div>
                <div style='font-size: 14px; color: {$this->brandContrast}; font-style: italic;'>\"{$booking['notes']}\"</div>
            </div>" : "") . "
        ";

        $htmlMessage = $this->renderLayout($content);

        $this->email->setTo($adminEmail);
        $this->email->setSubject($subject);
        $this->email->setMessage($htmlMessage);
        $this->email->setMailType('html');
        return $this->email->send();
    }
}
