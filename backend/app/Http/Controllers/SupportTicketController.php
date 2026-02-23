<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportTicketController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = SupportTicket::where('user_id', Auth::id())->get();
        return response()->json(['status' => 'success', 'data' => $tickets]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['subject' => 'required', 'message' => 'required']);
        return response()->json(['status' => 'success', 'message' => 'Ticket submitted.']);
    }

    public function show(SupportTicket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);
        return response()->json(['status' => 'success', 'data' => $ticket]);
    }
}
