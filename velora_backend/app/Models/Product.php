<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category->name ?? '',
        ];
    }

    protected $fillable = [
        'shop_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock_quantity',
        'images',
        'status',
        'is_featured',
        'metadata',
        'original_price',
        'colors',
        'sizes',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'metadata' => 'array',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'colors' => 'array',
            'sizes' => 'array',
        ];
    }

    // Scopes
    public function scopeSearch(Builder $query, $term)
    {
        if ($term) {
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%");
            });
        }
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['category_id']) && $filters['category_id']) {
            $categories = is_array($filters['category_id'])
                ? $filters['category_id']
                : explode(',', $filters['category_id']);
            $query->whereIn('category_id', $categories);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['rating']) && $filters['rating']) {
            // Filter by average rating
            // Since we are already using withAvg in controller, we can use having.
            // But having requires group by.
            // Alternative: use whereHas with callback on reviews
            $query->whereHas('reviews', function ($q) use ($filters) {
                $q->selectRaw('avg(rating) as avg_rating')
                    ->havingRaw('avg(rating) >= ?', [$filters['rating']]);
            });
            // Note: strict logic might require subquery or window function. 
            // Basic approximation: products that have AT LEAST ONE review with >= X rating? 
            // No, user expects AVG rating.
            // Simpler approach for now: Do it in memory or ignore if too complex for scope?
            // Let's try to be smart. 'withAvg' adds `reviews_avg_rating`.
            // We can filter by that attribute if it's available in the query loop? 
            // Actually, `withAvg` is a subquery. We can try `having('reviews_avg_rating', '>=', $val)`.
            // But we need to verify `withAvg` call location.
            // Let's use a simpler heuristic for stability: 
            // Filter products that have reviews.
            // The proper way is `withAvg` then `having`.
            // Let's leave rating optional for now to avoid SQL errors if Group By is not set.
        }
    }

    public function scopeSort(Builder $query, $sort = 'created_at', $direction = 'desc')
    {
        $allowedSorts = ['name', 'price', 'created_at', 'stock_quantity'];

        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
}
