<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = [
        'code',
        'name',
        'currency_code',
        'locale',
        'tax_rate',
        'shipping_region',
        'is_active',
    ];
}
