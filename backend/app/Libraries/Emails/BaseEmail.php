<?php

namespace App\Libraries\Emails;

abstract class BaseEmail
{
    protected $email;
    protected $brandPrimary = "#B86B5A";
    protected $brandBase = "#FBF8F1";
    protected $brandContrast = "#2D2422";
    protected $brandSecondary = "#8C9B86";
    protected $frontendUrl;
    protected $logoUrl;

    public function __construct()
    {
        $this->email = \Config\Services::email();
        $this->frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $this->logoUrl = "{$this->frontendUrl}/images/logo.webp";
    }

    /**
     * Renders the common HTML layout for emails
     */
    protected function renderLayout(string $content): string
    {
        return "<!DOCTYPE html>
        <html lang='it'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <style>
                @media only screen and (max-width: 600px) {
                    .email-wrapper {
                        padding: 15px !important;
                    }
                    .email-container {
                        border-radius: 20px !important;
                    }
                    .email-header {
                        padding: 20px !important;
                    }
                    .email-body {
                        padding: 25px !important;
                    }
                    .email-footer {
                        padding: 20px !important;
                    }
                    .h1-title {
                        font-size: 24px !important;
                    }
                    .h2-title {
                        font-size: 22px !important;
                    }
                    .text-base {
                        font-size: 14px !important;
                    }
                    .detail-box {
                        padding: 20px !important;
                    }
                    .btn-confirmation {
                        padding: 15px 30px !important;
                        font-size: 14px !important;
                    }
                }
            </style>
        </head>
        <body style='margin: 0; padding: 0;'>
            <div class='email-wrapper' style='background-color: {$this->brandBase}; padding: 40px; font-family: sans-serif; color: {$this->brandContrast};'>
                <div class='email-container' style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(184, 107, 90, 0.12);'>
                    <div class='email-header' style='padding: 30px; text-align: center; border-bottom: 1px solid rgba(45, 36, 34, 0.05);'>
                        <img src='{$this->logoUrl}' alt='Logo' style='width: 50px; height: 50px; margin-bottom: 10px;'>
                        <div class='h1-title' style='font-family: serif; font-size: 24px; color: {$this->brandPrimary};'>Stefania</div>
                        <div style='font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(45, 36, 34, 0.6);'>Mastroianni</div>
                    </div>
                    <div class='email-body' style='padding: 40px;'>
                        {$content}
                    </div>
                    <div class='email-footer' style='padding: 30px; background-color: rgba(45, 36, 34, 0.02); text-align: center; font-size: 12px; color: rgba(45, 36, 34, 0.5);'>
                        <p>Stefania Mastroianni • Trattamenti e Benessere</p>
                        <p style='margin-top: 10px;'>Questa è un'email automatica, per favore non rispondere direttamente.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    }

    /**
     * Send the email
     */
    public function send(string $to, string $subject, string $htmlMessage, string $plainTextMessage = ''): bool
    {
        $this->email->setTo($to);
        $this->email->setSubject($subject);
        $this->email->setMessage($htmlMessage);
        $this->email->setMailType('html');
        
        if ($plainTextMessage) {
            $this->email->setAltMessage($plainTextMessage);
        }

        return $this->email->send();
    }
}
