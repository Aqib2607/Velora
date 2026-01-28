<?php

namespace App\Services;

use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageService
{
    public function __construct()
    {
        // No driver needed
    }

    public function optimizeAndSave($file, $path, $width = 1000, $height = 1000)
    {
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        // Simple storage without optimization
        $savedPath = $file->storeAs($path, $filename, 'public');
        
        return 'storage/' . $savedPath;
    }

    public function createThumbnail($file, $path, $width = 300, $height = 300)
    {
        // Just reuse original for now since we can't resize
        return $this->optimizeAndSave($file, $path . '/thumbnails', $width, $height);
    }
}
