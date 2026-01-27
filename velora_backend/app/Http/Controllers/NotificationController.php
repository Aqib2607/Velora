<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends BaseController
{
    public function index(Request $request)
    {
        $notifications = $request->user()->unreadNotifications()->latest()->take(20)->get();

        return $this->success('Notifications retrieved', $notifications);
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
