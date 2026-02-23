<?php

namespace App\Http\Controllers;

use App\Models\LedgerAccount;
use App\Models\LedgerTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LedgerController extends Controller
{
    public function accounts(): JsonResponse
    {
        $this->authorize('viewLedger', LedgerAccount::class);
        $accounts = LedgerAccount::all();
        return response()->json(['status' => 'success', 'data' => $accounts]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $this->authorize('viewLedger', LedgerAccount::class);
        $txns = LedgerTransaction::with('entries.account')
            ->when($request->reference, fn($q, $r) => $q->where('reference', 'like', "%{$r}%"))
            ->orderByDesc('posted_at')
            ->paginate(20);

        return response()->json(['status' => 'success', 'data' => $txns]);
    }

    public function show(LedgerTransaction $transaction): JsonResponse
    {
        $this->authorize('viewLedger', LedgerAccount::class);
        return response()->json([
            'status' => 'success',
            'data'   => $transaction->load('entries.account'),
        ]);
    }
}
