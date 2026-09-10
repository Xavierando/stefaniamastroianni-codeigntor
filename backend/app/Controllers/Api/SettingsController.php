<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\SiteSettingsModel;

class SettingsController extends ResourceController
{
    protected $modelName = SiteSettingsModel::class;
    protected $format = 'json';

    /**
     * Lettura pubblica. Espone solo le chiavi in whitelist: la tabella e
     * generica e potrebbe ospitare in futuro valori non pubblici.
     */
    public function index()
    {
        $model = new SiteSettingsModel();

        return $this->respond([
            'whatsappEnabled' => $model->getSetting('whatsapp_enabled', '0') === '1',
            'whatsappHandle'  => (string) $model->getSetting('whatsapp_handle', ''),
        ]);
    }

    public function update($id = null)
    {
        $model = new SiteSettingsModel();

        $enabled = (bool) $this->request->getJsonVar('whatsappEnabled');
        $handle  = $this->normalizeHandle((string) $this->request->getJsonVar('whatsappHandle'));

        // Toggle attivo con handle vuoto significherebbe link wa.me rotti su
        // tutto il sito pubblico: si rifiuta prima di scrivere.
        if ($enabled && $handle === '') {
            return $this->failValidationErrors(
                "Con WhatsApp attivo l'username non puo essere vuoto."
            );
        }

        $model->setSetting('whatsapp_enabled', $enabled ? '1' : '0');
        $model->setSetting('whatsapp_handle', $handle);

        return $this->respond([
            'whatsappEnabled' => $enabled,
            'whatsappHandle'  => $handle,
        ]);
    }

    /**
     * Spazi, +, trattini e parentesi via: un numero di telefono incollato in
     * qualunque formato diventa valido per wa.me, e un username resta intatto.
     */
    private function normalizeHandle(string $raw): string
    {
        return preg_replace('/[\s+()\-]/', '', trim($raw)) ?? '';
    }
}
