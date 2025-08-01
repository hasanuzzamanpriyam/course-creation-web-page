<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;

Route::get('/', function () {
    return view('Home');
});




Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
