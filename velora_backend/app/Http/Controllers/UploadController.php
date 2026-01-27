<?php

namespace App\Http\Controllers;

use App\Services\ImageService;
use Illuminate\Http\Request;

class UploadController extends BaseController
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'folder' => 'nullable|string|max:50',
        ]);

        $file = $request->file('file');
        $folder = $request->input('folder', 'uploads');
        $mime = $file->getMimeType();

        if (str_starts_with($mime, 'image/')) {
            // Handle Image
            $url = $this->imageService->optimizeAndSave($file, $folder);
            $thumbnail = $this->imageService->createThumbnail($file, $folder);

            return $this->success('Image uploaded successfully', [
                'url' => asset($url),
                'thumbnail_url' => asset($thumbnail),
                'type' => 'image',
                'mime' => $mime,
            ]);
        } else {
            // Handle generic file
            $path = $file->store($folder, 'public');

            return $this->success('File uploaded successfully', [
                'url' => asset('storage/'.$path),
                'type' => 'file',
                'mime' => $mime,
            ]);
        }
    }
}
