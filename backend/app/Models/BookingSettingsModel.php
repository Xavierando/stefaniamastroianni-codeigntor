<?php

namespace App\Models;

use CodeIgniter\Model;

class BookingSettingsModel extends Model
{
    protected $table            = 'booking_settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['setting_key', 'setting_value'];

    // Dates
    protected $useTimestamps = true;
    protected $updatedField  = 'updated_at';
    protected $createdField  = '';
    protected $deletedField  = '';

    /**
     * Get a setting value by key.
     */
    public function getSetting(string $key, $default = null)
    {
        $setting = $this->where('setting_key', $key)->first();
        return $setting ? $setting['setting_value'] : $default;
    }

    /**
     * Update or insert a setting value by key.
     */
    public function setSetting(string $key, $value)
    {
        $setting = $this->where('setting_key', $key)->first();
        if ($setting) {
            return $this->update($setting['id'], ['setting_value' => $value]);
        } else {
            return $this->insert(['setting_key' => $key, 'setting_value' => $value]);
        }
    }

    /**
     * Get all settings as a key-value pair array.
     */
    public function getAllSettings(): array
    {
        $settings = $this->findAll();
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting['setting_key']] = $setting['setting_value'];
        }
        return $result;
    }
}
