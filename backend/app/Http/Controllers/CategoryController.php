<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with('children')->whereNull('parent_id')->get();
        return response()->json(['status' => 'success', 'data' => $categories]);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => $category->load('children', 'products')]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Category::class);
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|unique:categories,slug',
            'parent_id'   => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);

        $category = Category::create($validated);
        return response()->json(['status' => 'success', 'data' => $category], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $this->authorize('update', $category);
        $category->update($request->validate([
            'name'       => 'sometimes|string|max:255',
            'is_active'  => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]));

        return response()->json(['status' => 'success', 'data' => $category->fresh()]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', $category);
        $category->delete();
        return response()->json(['status' => 'success', 'data' => ['message' => 'Category deleted.']]);
    }
}
