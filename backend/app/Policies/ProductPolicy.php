<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function update(User $user, Product $product): bool
    {
        return $user->sellerProfile?->id === $product->seller_profile_id
            || $user->hasRole('admin');
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->update($user, $product);
    }

    public function create(User $user): bool
    {
        return $user->isSeller() || $user->hasRole('admin');
    }

    /**
     * Admin-only: view ledger data.
     */
    public function viewLedger(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Admin check used inline.
     */
    public function admin(User $user): bool
    {
        return $user->hasRole('admin');
    }
}
