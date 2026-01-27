<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends BaseController
{
    /**
     * Display a listing of the resource (Public Tree).
     */
    public function index()
    {
        // Cache categories tree for 24 hours (1440 mins)
        $categories = \Illuminate\Support\Facades\Cache::remember('categories_tree', 60 * 24, function () {
            return Category::with('children')->whereNull('parent_id')->get();
        });

        return $this->success('Categories retrieved successfully', $categories);
    }

    /**
     * Store a newly created resource in storage (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
        ]);

        return $this->success('Category created successfully', $category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::with('children', 'parent')->findOrFail($id);

        return $this->success('Category retrieved successfully', $category);
    }

    /**
     * Update the specified resource in storage (Admin only).
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($request->has('name')) {
            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
        }
        if ($request->has('parent_id')) {
            $category->parent_id = $request->parent_id;
        }

        $category->save();

        return $this->success('Category updated successfully', $category);
    }

    /**
     * Remove the specified resource from storage (Admin only).
     */
    public function destroy(string $id)
    {
        Category::destroy($id);

        return $this->success('Category deleted successfully');
    }
}
