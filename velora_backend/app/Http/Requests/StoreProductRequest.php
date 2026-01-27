<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Permission check usually handled by Policy, but ensure user can create.
        // For now, allow if authenticated (middleware handles this).
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array',
            'images.*' => 'string', // URL or path
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'metadata' => 'nullable|array',
        ];
    }
}
