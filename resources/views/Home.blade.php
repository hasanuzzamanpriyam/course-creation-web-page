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

        <!-- Form -->
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



    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $('#course-form').on('submit', function(e) {
            e.preventDefault();

            // Create FormData object for file + text upload
            let formData = new FormData();

            // Add course info
            formData.append('title', $('#course-title').val());
            formData.append('description', $('#course-description').val());
            formData.append('category', $('#course-category').val());

            let modules = [];

            $('.module').each(function(moduleIndex) {
                let moduleData = {
                    title: $(this).find("input[name='module_title[]']").val(),
                    contents: []
                };

                $(this).find('.content').each(function(contentIndex) {
                    let contentType = $(this).find("select[name='content_type[]']").val();

                    // Check if user selected image
                    if (contentType === "image") {
                        let fileInput = $(this).find("input[name='content_details[]']")[0];
                        if (fileInput && fileInput.files.length > 0) {
                            // Add image file to FormData (e.g., modules[0][contents][0][details])
                            formData.append(
                                `modules[${moduleIndex}][contents][${contentIndex}][details]`,
                                fileInput.files[0]);
                        }
                    } else {
                        // Add normal text details
                        formData.append(
                            `modules[${moduleIndex}][contents][${contentIndex}][details]`, $(
                                this).find("input[name='content_details[]']").val());
                    }

                    // Add content title and type
                    formData.append(`modules[${moduleIndex}][contents][${contentIndex}][title]`, $(
                        this).find("input[name='content_title[]']").val());
                    formData.append(`modules[${moduleIndex}][contents][${contentIndex}][type]`,
                        contentType);
                });

                // Add module title
                formData.append(`modules[${moduleIndex}][title]`, moduleData.title);
            });

            // Send FormData via AJAX
            $.ajax({
                url: "{{ route('courses.store') }}",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
            });
        });
    </script>
</body>

</html>
