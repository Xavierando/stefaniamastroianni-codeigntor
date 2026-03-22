<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NewsletterModel;
use App\Models\NewsletterSubscriberModel;

class AdminNewsletterController extends ResourceController
{
    protected $format = 'json';
    protected $newsletterModel;
    protected $subscriberModel;

    public function __construct()
    {
        $this->newsletterModel = new NewsletterModel();
        $this->subscriberModel = new NewsletterSubscriberModel();
    }

    private function renderEmailTemplate($content, $subscriberId)
    {
        // Replace &nbsp; with regular spaces to prevent long strings from breaking layout
        $content = str_replace('&nbsp;', ' ', $content);
        
        $frontendUrl = \rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:5173', '/');
        $unsubscribeLink = $frontendUrl . '/unsubscribe?token=' . \urlencode($subscriberId);

        return <<<HTML
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Newsletter Stefania Mastroianni</title>
<style>
    body {
        margin: 0;
        padding: 0;
        background-color: #f1e5cb;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #6e4d47;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }
    table {
        border-spacing: 0;
        margin: 0 auto;
    }
    td {
        padding: 0;
    }
    img {
        border: 0;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
    }
    .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f1e5cb;
        padding: 40px 0;
    }
    .main {
        background-color: #ffffff;
        width: 100%;
        max-width: 600px;
        color: #6e4d47;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(110, 77, 71, 0.1);
    }
    .header {
        background-color: #6e4d47;
        padding: 30px 20px;
        text-align: center;
    }
    .header h1 {
        color: #f1e5cb;
        margin: 0;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: 1px;
    }
    .content {
        padding: 40px 30px;
        line-height: 1.6;
        font-size: 16px;
        word-break: break-word;
    }
    .content * {
        max-width: 100% !important;
    }
    .content img {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 8px;
    }
    .content table {
        width: 100% !important;
        max-width: 100% !important;
    }
    .footer {
        background-color: #f9f6f0;
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #6e4d47;
        border-top: 1px solid #eaddc4;
    }
    .footer a {
        color: #ff6b35;
        text-decoration: underline;
    }
    @media screen and (max-width: 600px) {
        .wrapper {
            padding: 10px !important;
        }
        .main {
            border-radius: 8px !important;
        }
        .header {
            padding: 20px 10px !important;
        }
        .content {
            padding: 20px 15px !important;
        }
        .header h1 {
            font-size: 22px !important;
        }
    }
</style>
</head>
<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <!-- Header -->
            <tr>
                <td class="header">
                    <h1>Stefania Mastroianni</h1>
                </td>
            </tr>
            <!-- Body -->
            <tr>
                <td class="content">
                    {$content}
                </td>
            </tr>
            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p style="margin: 0 0 10px 0;">Stefania Mastroianni &copy; 2026. Tutti i diritti riservati.</p>
                    <p style="margin: 0;">Se non desideri pi&ugrave; ricevere queste email, puoi <a href="{$unsubscribeLink}">cliccare qui per disiscriverti</a>.</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
HTML;
    }

    // --- Newsletter Campaigns ---

    public function getNewsletters()
    {
        return $this->respond($this->newsletterModel->orderBy('created_at', 'DESC')->findAll());
    }

    public function getNewsletter($id)
    {
        $newsletter = $this->newsletterModel->find($id);
        if (!$newsletter)
            return $this->failNotFound();
        return $this->respond($newsletter);
    }

    public function createNewsletter()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($data['subject'])) {
            return $this->failValidationErrors(['subject' => 'Subject is required']);
        }

        if ($this->newsletterModel->insert($data)) {
            $data['id'] = $this->newsletterModel->getInsertID();
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }
        return $this->failValidationErrors($this->newsletterModel->errors());
    }

    public function updateNewsletter($id)
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if ($this->newsletterModel->update($id, $data)) {
            return $this->respond(['success' => true]);
        }
        return $this->failValidationErrors($this->newsletterModel->errors());
    }

    public function deleteNewsletter($id)
    {
        if ($this->newsletterModel->delete($id)) {
            return $this->respondDeleted(['success' => true]);
        }
        return $this->failNotFound();
    }

    // --- Subscribers Management ---

    public function getSubscribers()
    {
        return $this->respond($this->subscriberModel->orderBy('createdAt', 'DESC')->findAll());
    }

    public function deleteSubscriber($id)
    {
        if ($this->subscriberModel->delete($id)) {
            return $this->respondDeleted(['success' => true]);
        }
        return $this->failNotFound('Subscriber not found');
    }

    // --- Sending Engine Engine ---

    public function startSending($id)
    {
        $newsletter = $this->newsletterModel->find($id);
        if (!$newsletter)
            return $this->failNotFound();

        $total = $this->subscriberModel->countAllResults();

        $data = [
            'status' => 'sending',
            'total_subscribers' => $total,
            'sent_count' => 0,
            'last_sent_sequence_id' => 0
        ];

        $this->newsletterModel->update($id, $data);

        return $this->respond([
            'success' => true,
            'total_subscribers' => $total,
            'message' => 'Sending initialized'
        ]);
    }

    public function sendNext($id)
    {
        $newsletter = $this->newsletterModel->find($id);
        if (!$newsletter)
            return $this->failNotFound();
        if ($newsletter['status'] === 'sent') {
            return $this->respond(['success' => true, 'has_more' => false, 'sent_count' => $newsletter['sent_count']]);
        }

        // Get the NEXT subscriber using sequence_id
        $last_seq = $newsletter['last_sent_sequence_id'];

        $nextSubscriber = $this->subscriberModel
            ->where('sequence_id >', $last_seq)
            ->orderBy('sequence_id', 'ASC')
            ->first();

        if ($nextSubscriber) {
            // Setup email
            $email = \Config\Services::email();
            $email->setTo($nextSubscriber['email']);
            $email->setSubject($newsletter['subject']);
            $email->setMessage($this->renderEmailTemplate($newsletter['content'], $nextSubscriber['id']));

            // Try to send
            if ($email->send()) {
                // Success
            } else {
                // Failed, but we'll still mark as read so we don't get stuck in an infinite loop
                // You could log the error here: $email->printDebugger(['headers'])
            }

            // Update stats
            $sentCount = $newsletter['sent_count'] + 1;
            $this->newsletterModel->update($id, [
                'last_sent_sequence_id' => $nextSubscriber['sequence_id'],
                'sent_count' => $sentCount
            ]);

            return $this->respond([
                'success' => true,
                'has_more' => true,
                'sent_count' => $sentCount,
                'sent_to' => $nextSubscriber['email']
            ]);
        } else {
            // No more subscribers found!
            $this->newsletterModel->update($id, ['status' => 'sent']);
            return $this->respond([
                'success' => true,
                'has_more' => false,
                'sent_count' => $newsletter['sent_count']
            ]);
        }
    }

    public function testSend($id)
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($data['email'])) {
            return $this->failValidationErrors(['email' => 'Recipient email is required for testing.']);
        }

        $newsletter = $this->newsletterModel->find($id);
        if (!$newsletter)
            return $this->failNotFound();

        $email = \Config\Services::email();
        $email->setTo($data['email']);
        $email->setSubject('[TEST] ' . $newsletter['subject']);
        $email->setMessage($this->renderEmailTemplate($newsletter['content'] ?? 'Nessun contenuto in questa email di test.', 'TEST_UUID'));

        if ($email->send()) {
            return $this->respond([
                'success' => true,
                'message' => 'Email di test inviata con successo usando ' . $email->protocol . '!'
            ]);
        } else {
            return $this->respond([
                'success' => false,
                'message' => 'Impossibile inviare la mail. Controllare i log SMTP.',
                'debug' => $email->printDebugger(['headers', 'subject', 'body'])
            ], 500);
        }
    }
}
