<?php

namespace App\Models;

use CodeIgniter\Model;

class SiteSettingsModel extends Model
{
    protected $table            = 'site_settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['setting_key', 'setting_value'];

    protected $useTimestamps = true;
    protected $updatedField  = 'updated_at';
    protected $createdField  = '';
    protected $deletedField  = '';

    public function getSetting(string $key, $default = null)
    {
        $setting = $this->where('setting_key', $key)->first();
        return $setting ? $setting['setting_value'] : $default;
    }

    public function setSetting(string $key, $value)
    {
        $setting = $this->where('setting_key', $key)->first();
        if ($setting) {
            return $this->update($setting['id'], ['setting_value' => $value]);
        }
        return $this->insert(['setting_key' => $key, 'setting_value' => $value]);
    }
}
