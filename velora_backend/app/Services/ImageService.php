<?php

namespace App\Services;

use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver);
    }

    public function optimizeAndSave($file, $path, $width = 1000, $height = 1000)
    {
        $image = $this->manager->read($file);
        $image->scale(width: $width, height: $height);
        $encoded = $image->toWebp(quality: 80);

        $filename = uniqid().'.webp';
        $savePath = $path.'/'.$filename;

        \Illuminate\Support\Facades\Storage::disk('public')->put($savePath, $encoded);

        return 'storage/'.$savePath;
    }

    public function createThumbnail($file, $path, $width = 300, $height = 300)
    {
        $image = $this->manager->read($file);
        $image->cover(width: $width, height: $height);
        $encoded = $image->toWebp(quality: 60);

        $filename = uniqid().'_thumb.webp';
        $savePath = $path.'/thumbnails/'.$filename;

        \Illuminate\Support\Facades\Storage::disk('public')->put($savePath, $encoded);

        return 'storage/'.$savePath;
    }
}
