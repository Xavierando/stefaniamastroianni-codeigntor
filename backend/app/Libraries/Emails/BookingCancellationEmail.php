<?php

namespace App\Libraries\Emails;

class BookingCancellationEmail extends BaseEmail
{
    public function notifyAdmin(array $booking, string $title, \DateTime $startTime, ?string $notes)
    {
        $adminEmail = config('Email')->fromEmail;
        $subject = "Prenotazione Cancellata: {$booking['name']}";
        
        $content = "
            <div style='text-align: center; margin-bottom: 30px;'>
                <div style='display: inline-block; background-color: rgba(184, 107, 90, 0.1); color: #B86B5A; padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>⚠️ Cancellazione</div>
            </div>
            
            <h2 class='h2-title' style='font-family: serif; color: #B86B5A; margin-bottom: 20px; font-size: 24px; text-align: center;'>Appuntamento Annullato</h2>
            
            <p class='text-base' style='font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;'>
                La prenotazione di <strong>{$booking['name']}</strong> per il <strong>" . $startTime->format('d/m/Y') . "</strong> alle <strong>" . $startTime->format('H:i') . "</strong> è stata cancellata.
            </p>

            <div class='detail-box' style='background-color: rgba(45, 36, 34, 0.02); padding: 30px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(45, 36, 34, 0.05);'>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding-bottom: 15px; border-bottom: 1px solid rgba(45, 36, 34, 0.05);'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Cliente</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$booking['name']}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding-top: 15px; padding-bottom: 15px;'>
                            <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Servizio / Evento</div>
                            <div class='text-base' style='font-size: 16px; font-weight: bold; color: {$this->brandContrast};'>{$title}</div>
                        </td>
                    </tr>
                </table>
            </div>

            " . ($notes ? "
            <div style='padding: 20px; background-color: #fff; border-left: 4px solid #B86B5A; margin-top: 10px;'>
                <div style='font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(45, 36, 34, 0.4);'>Note/Motivazione</div>
                <div style='font-size: 14px; color: {$this->brandContrast}; font-style: italic;'>\"{$notes}\"</div>
            </div>" : "") . "
        ";

        $htmlMessage = $this->renderLayout($content);

        $this->email->setTo($adminEmail);
        $this->email->setSubject($subject);
        $this->email->setMessage($htmlMessage);
        $this->email->setMailType('html');
        return $this->email->send();
    }

    /**
     * Sends a cancellation confirmation to the client
     */
    public function sendCancellationToClient(array $booking, string $title, \DateTime $startTime)
    {
        $content = "
            <div style='text-align: center; margin-bottom: 30px;'>
                <div style='display: inline-block; background-color: rgba(45, 36, 34, 0.05); color: rgba(45, 36, 34, 0.6); padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Prenotazione Annullata</div>
            </div>
            
            <h2 class='h2-title' style='font-family: serif; color: {$this->brandPrimary}; margin-bottom: 20px; font-size: 28px; text-align: center;'>Conferma Annullamento</h2>
            
            <p class='text-base' style='font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;'>
                Gentile <strong>{$booking['name']}</strong>, ti confermiamo che la tua prenotazione per <strong>{$title}</strong> del {$startTime->format('d/m/Y')} alle ore {$startTime->format('H:i')} è stata annullata correttamente come da tua richiesta.
            </p>
            
            <div style='background-color: rgba(45, 36, 34, 0.02); padding: 30px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(45, 36, 34, 0.05);'>
                <p class='text-base' style='font-size: 15px; color: rgba(45, 36, 34, 0.7); text-align: center; margin: 0;'>
                    Il posto è stato liberato. Se desideri prenotare un nuovo appuntamento, puoi farlo in qualsiasi momento tramite il nostro sito.
                </p>
            </div>
            
            <div style='text-align: center; margin-top: 30px;'>
                <p class='text-base' style='font-size: 13px; color: rgba(45, 36, 34, 0.5);'>
                    A presto, Stefania.
                </p>
            </div>
        ";

        $htmlMessage = $this->renderLayout($content);
        $subject = "Conferma Annullamento Prenotazione - Stefania Mastroianni";

        return $this->send($booking['email'], $subject, $htmlMessage);
    }
}
