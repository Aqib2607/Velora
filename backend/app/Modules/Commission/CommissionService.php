<?php

namespace App\Modules\Commission;

use App\Models\CommissionRecord;
use App\Models\CommissionRule;
use App\Models\OrderItem;

class CommissionService
{
    /**
     * Calculate and record commission for a single order item.
     */
    public function calculate(OrderItem $item, int $tenantId): CommissionRecord
    {
        $rule = $this->resolveRule($item, $tenantId);

        $commissionAmount = match ($rule->type) {
            'percentage' => round($item->total * ($rule->rate / 100), 2),
            'flat'       => min($rule->rate, $item->total),
            default      => 0,
        };

        $sellerPayout = round($item->total - $commissionAmount, 2);

        return CommissionRecord::create([
            'tenant_id'          => $tenantId,
            'order_item_id'      => $item->id,
            'seller_profile_id'  => $item->seller_profile_id,
            'commission_rule_id' => $rule->id,
            'sale_amount'        => $item->total,
            'commission_amount'  => $commissionAmount,
            'seller_payout'      => $sellerPayout,
            'status'             => 'pending',
        ]);
    }

    private function resolveRule(OrderItem $item, int $tenantId): CommissionRule
    {
        $sku = $item->sku()->with('product.category')->first();
        $categoryId = $sku?->product?->category_id;

        // Try category-specific rule first, fall back to default
        return CommissionRule::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->where(function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId)->orWhere('is_default', true);
            })
            ->orderByRaw('CASE WHEN category_id = ? THEN 0 ELSE 1 END', [$categoryId])
            ->firstOrFail();
    }
}
