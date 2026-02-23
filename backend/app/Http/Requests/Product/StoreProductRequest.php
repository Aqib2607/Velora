<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'       => 'nullable|exists:categories,id',
            'name'              => 'required|string|max:255',
            'slug'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'thumbnail'         => 'nullable|string|url',
            'images'            => 'nullable|array',
            'images.*'          => 'url',
            'status'            => 'in:draft,active,inactive,archived',
            'attributes'        => 'nullable|array',
        ];
    }
}
