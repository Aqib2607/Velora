<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Resize and encode image.
     */
    public function optimizeAndSave($file, $path, $width = 1000, $height = 1000)
    {
        $image = $this->manager->read($file);
        
        $image->scale(width: $width, height: $height);
        
        $encoded = $image->toWebp(quality: 80);
        
        $filename = uniqid() . '.webp';
        $fullPath = $path . '/' . $filename;
        
        \Illuminate\Support\Facades\Storage::disk('public')->put($fullPath, $encoded);
        
        return asset('storage/' . $fullPath);
    }
}
