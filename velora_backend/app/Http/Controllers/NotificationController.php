<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                \Illuminate\Support\Facades\Log::error('NotificationController: No user found in request');
                return $this->error('User not found', 401);
            }

            $notifications = $user->unreadNotifications()->latest()->take(20)->get();
            return $this->success('Notifications retrieved', $notifications);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('NotificationController Error: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return $this->error('Failed to fetch notifications: ' . $e->getMessage(), 500);
        }
    }

    public function markAsRead(Request $request, $id = null)
    {
        $user = $request->user();

        if ($id && $id !== 'all') {
            $notification = $user->notifications()->where('id', $id)->first();
            if ($notification) {
                $notification->markAsRead();
            }
        } else {
            $user->unreadNotifications->markAsRead();
        }

        return $this->success('Notifications marked as read');
    }
}
