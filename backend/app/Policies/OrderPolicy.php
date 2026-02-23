<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return $user->id === $order->user_id || $user->hasRole('admin');
    }

    public function update(User $user, Order $order): bool
    {
        return $user->id === $order->user_id && $order->isCancellable();
    }

    public function viewAny(User $user): bool
    {
        return true;
    }
}
