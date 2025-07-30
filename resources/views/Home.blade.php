<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Create Course</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>

<body>

    <div class="container">
        <h1>Create a New Course</h1>
        <form id="course-form" enctype="multipart/form-data">
            <label>Course Title</label>
            <input type="text" name="title" id="course-title">

            <label>Description</label>
            <textarea name="description" id="course-description"></textarea>

            <label>Category</label>
            <input type="text" name="category" id="course-category">

            <div id="modules-wrapper"></div>
            <button type="button" id="add-module" class="btn">+ Add Module</button>

            <button type="submit" id="submit-course" class="submit-btn">Submit</button>
        </form>
    </div>

    <script src="{{ asset('js/main.js') }}"></script>
</body>

</html>
