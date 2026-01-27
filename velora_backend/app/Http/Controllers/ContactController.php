<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Http\Requests\StoreContactRequest;
use App\Traits\ApiResponse;

class ContactController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success('Messages retrieved', ContactMessage::latest()->paginate(10));
    }

    public function store(StoreContactRequest $request)
    {
        $message = ContactMessage::create($request->validated());
        return $this->success('Message sent successfully', $message, 201);
    }
}
