<?php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'modules' => 'required|array|min:1',
            'modules.*.title' => 'required|string|max:255',
            'modules.*.contents' => 'nullable|array',
            'modules.*.contents.*.title' => 'required|string|max:255',
            'modules.*.contents.*.type' => 'required|in:text,image,video,link',
            'modules.*.contents.*.details' => 'nullable',
        ]);

        foreach ($request->modules as $mIndex => $module) {
            foreach ($module['contents'] ?? [] as $cIndex => $content) {
                if ($content['type'] === 'image' && !isset($content['details'])) {
                    return response()->json([
                        'message' => "Image is required for Content " . ($cIndex + 1) . " in Module " . ($mIndex + 1)
                    ], 422);
                }
            }
        }

        DB::transaction(function () use ($request) {
            $course = Course::create([
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
            ]);

            foreach ($request->modules as $moduleData) {
                $module = Module::create([
                    'course_id' => $course->id,
                    'title' => $moduleData['title'],
                ]);

                foreach ($moduleData['contents'] ?? [] as $contentData) {
                    $contentType = $contentData['type'];
                    $contentDetails = null;

                    if ($contentType === 'image' && $contentData['details'] instanceof \Illuminate\Http\UploadedFile) {
                        $imagePath = $contentData['details']->store('uploads/images', 'public');
                        $contentDetails = $imagePath;
                    } else {
                        $contentDetails = $contentData['details'] ?? null;
                    }

                    Content::create([
                        'module_id' => $module->id,
                        'title' => $contentData['title'],
                        'type' => $contentType,
                        'details' => $contentDetails,
                    ]);
                }
            }
        });

        return response()->json(['message' => 'New Course created successfully!']);
    }
}
