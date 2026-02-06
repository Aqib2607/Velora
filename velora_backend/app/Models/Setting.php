<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
    ];

    /**
     * Get value cast to type
     */
    public function getValueAttribute($value)
    {
        if ($this->type === 'json') {
            return json_decode($value, true);
        }
        if ($this->type === 'boolean') {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        if ($this->type === 'integer') {
            return (int) $value;
        }

        return $value;
    }
}
