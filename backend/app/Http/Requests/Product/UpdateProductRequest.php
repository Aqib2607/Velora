<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'  => 'sometimes|nullable|exists:categories,id',
            'name'         => 'sometimes|string|max:255',
            'description'  => 'sometimes|nullable|string',
            'status'       => 'sometimes|in:draft,active,inactive,archived',
            'attributes'   => 'sometimes|nullable|array',
        ];
    }
}
