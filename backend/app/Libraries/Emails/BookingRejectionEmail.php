<?php

namespace App\Libraries\Emails;

class BookingRejectionEmail extends BaseEmail
{
    public function sendRejection(array $booking, string $title, \DateTime $startTime)
    {
        $content = "
            <div style='text-align: center; margin-bottom: 30px;'>
                <div style='display: inline-block; background-color: rgba(45, 36, 34, 0.05); color: rgba(45, 36, 34, 0.6); padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Richiesta Non Confermata</div>
            </div>
            
            <h2 class='h2-title' style='font-family: serif; color: {$this->brandPrimary}; margin-bottom: 20px; font-size: 28px; text-align: center;'>Aggiornamento sulla tua richiesta</h2>
            
            <p class='text-base' style='font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;'>
                Gentile <strong>{$booking['name']}</strong>, ti informiamo che purtroppo non è stato possibile confermare la tua richiesta di prenotazione per <strong>{$title}</strong> del {$startTime->format('d/m/Y')} alle ore {$startTime->format('H:i')}.
            </p>
            
            <div style='background-color: rgba(45, 36, 34, 0.02); padding: 30px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(45, 36, 34, 0.05);'>
                <p class='text-base' style='font-size: 15px; color: rgba(45, 36, 34, 0.7); text-align: center; margin: 0;'>
                    La tua richiesta è stata annullata dai nostri sistemi. Per qualsiasi chiarimento o per provare a prenotare in un altro orario, non esitare a contattarci.
                </p>
            </div>
            
            <div style='text-align: center; margin-top: 30px;'>
                <p class='text-base' style='font-size: 13px; color: rgba(45, 36, 34, 0.5);'>
                    Ci scusiamo per il disagio.
                </p>
            </div>
        ";

        $htmlMessage = $this->renderLayout($content);
        $subject = "Aggiornamento Prenotazione - Stefania Mastroianni";

        return $this->send($booking['email'], $subject, $htmlMessage);
    }
}
