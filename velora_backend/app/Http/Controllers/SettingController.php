<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends BaseController
{
    /**
     * Get all settings grouped by group.
     */
    public function index()
    {
        $settings = Setting::all();
        $grouped = $settings->groupBy('group')->map(function ($group) {
            return $group->pluck('value', 'key');
        });

        // Ensure flattened structure or return specific keys if preferred
        // For frontend simplicity, returning a unified key-value map might be easier, or grouped.
        // Let's return a simple key-value map for now, as admin settings usually load all global configs.
        $flatSettings = $settings->pluck('value', 'key');

        return $this->success('Settings retrieved successfully', $flatSettings);
    }

    /**
     * Update or Create settings.
     * Expects an array of key-value pairs.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable', // Mixed types, will be cast to string usually or JSON
            'settings.*.group' => 'nullable|string',
        ]);

        $updated = [];

        foreach ($data['settings'] as $item) {
            $setting = Setting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'],
                    'group' => $item['group'] ?? 'general',
                    'type'  => $item['type'] ?? 'string'
                ]
            );
            $updated[$setting->key] = $setting->value;
        }

        return $this->success('Settings updated successfully', $updated);
    }
}
