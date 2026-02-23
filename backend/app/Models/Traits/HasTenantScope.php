<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasTenantScope
{
    /**
     * Boot the trait and apply the global tenant scope.
     */
    public static function bootHasTenantScope(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenant = app('tenant');
            if ($tenant) {
                $table = (new static())->getTable();
                $builder->where("{$table}.tenant_id", $tenant->id);
            }
        });

        static::creating(function ($model) {
            if (empty($model->tenant_id)) {
                $tenant = app('tenant');
                if ($tenant) {
                    $model->tenant_id = $tenant->id;
                }
            }
        });
    }

    /**
     * Scope to bypass tenant filter (admin use only).
     */
    public function scopeForAllTenants(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }
}
