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

        // Handle non vuoto ma di forma sbagliata (link incollato per intero,
        // @ davanti, dominio wa.me) produrrebbe link wa.me rotti su tutto il
        // sito pubblico esattamente come un handle vuoto: si rifiuta allo
        // stesso modo. Un handle vuoto con il toggle spento resta ammesso.
        if ($handle !== '' && !$this->isValidHandle($handle)) {
            return $this->failValidationErrors(
                'Username WhatsApp non valido. Usa il nome utente (es. xprot) o il numero in formato internazionale senza + (es. 393331234567).'
            );
        }

        $enabledSaved = $model->setSetting('whatsapp_enabled', $enabled ? '1' : '0');
        $handleSaved  = $model->setSetting('whatsapp_handle', $handle);

        if ($enabledSaved === false || $handleSaved === false) {
            return $this->failServerError('Salvataggio impostazioni non riuscito.');
        }

        return $this->respond([
            'whatsappEnabled' => $enabled,
            'whatsappHandle'  => $handle,
        ]);
    }

    /**
     * Spazi, +, trattini e parentesi via: un numero di telefono incollato in
     * qualunque formato diventa valido per wa.me, e un username resta intatto.
     * Rimuove anche una @ iniziale e un prefisso https://, http://, www. o
     * wa.me/ (in qualunque combinazione), cioe quello che si copia da
     * WhatsApp o dalla barra degli indirizzi del browser.
     */
    private function normalizeHandle(string $raw): string
    {
        $value = preg_replace('/[\s+()\-]/', '', trim($raw)) ?? '';
        $value = ltrim($value, '@');

        // Rimuove prefissi di URL ripetuti finche' ce ne sono (es. "wa.me/wa.me/xprot").
        do {
            $before = $value;
            $value  = preg_replace('#^(?:https?://|www\.|wa\.me/)#i', '', $value) ?? '';
        } while ($value !== $before);

        return $value;
    }

    /**
     * Accetta uno username WhatsApp (lettere, cifre, punto, underscore,
     * 3-64 caratteri) oppure un numero di telefono (8-15 cifre).
     */
    private function isValidHandle(string $handle): bool
    {
        return (bool) preg_match('/^(?:[A-Za-z0-9._]{3,64}|\d{8,15})$/', $handle);
    }
}
