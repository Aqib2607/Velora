<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shop;
use Illuminate\Http\Request;

class AdminController extends BaseController
{
    // --- User Management ---

    public function index()
    {
        $users = User::paginate(20);
        return $this->success('Users retrieved successfully', $users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return $this->success('User retrieved successfully', $user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Basic validation for role/status updates
        $data = $request->validate([
            'role' => 'sometimes|string|in:customer,vendor,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($data);

        return $this->success('User updated successfully', $user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return $this->success('User deleted successfully');
    }

    // --- Shop Management ---

    public function shopsIndex()
    {
        $shops = Shop::with('user')->paginate(20);
        return $this->success('Shops retrieved successfully', $shops);
    }

    public function approveShop($id)
    {
        $shop = Shop::findOrFail($id);
        $shop->update(['status' => 'active']);

        // Optionally update user role to vendor if not already
        if ($shop->user->role !== 'shop_owner') {
            $shop->user->update(['role' => 'shop_owner']);
        }

        return $this->success('Shop approved successfully', $shop);
    }

    public function suspendShop($id)
    {
        $shop = Shop::findOrFail($id);
        $shop->update(['status' => 'inactive']); // Or 'suspended' if enum supports it
        return $this->success('Shop suspended successfully', $shop);
    }
}
