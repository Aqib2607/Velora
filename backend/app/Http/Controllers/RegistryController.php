<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistryController extends Controller
{
    public function index(): JsonResponse
    {
        $registries = Registry::where('user_id', Auth::id())->get();
        return response()->json(['status' => 'success', 'data' => $registries]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['title' => 'required', 'event_date' => 'required|date']);
        return response()->json(['status' => 'success', 'message' => 'Registry created.']);
    }

    public function show(Registry $registry): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => $registry->load('items.sku')]);
    }

    public function addItem(Registry $registry, Request $request): JsonResponse
    {
        return response()->json(['status' => 'success', 'message' => 'Item added to registry.']);
    }
}
