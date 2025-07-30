$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    let moduleCount = 0;

    $(document).on("change", "select[name='content_type[]']", function () {
        let selectedType = $(this).val();
        let detailsField = $(this).siblings(".details-field");

        let fieldHtml = '<input type="text" name="content_details[]" placeholder="Enter details">';
        if (selectedType === "image") {
            fieldHtml = '<input type="file" name="content_details[]" accept="image/*">';
        } else if (selectedType === "video") {
            fieldHtml = '<input type="text" name="content_details[]" placeholder="Enter video URL">';
        } else if (selectedType === "link") {
            fieldHtml = '<input type="text" name="content_details[]" placeholder="Enter link URL">';
        }
        detailsField.html(fieldHtml);
    });

    $("#add-module").click(function () {
        moduleCount++;
        let moduleHTML = `
          <div class="module" data-module-id="${moduleCount}">
            <h3>Module ${moduleCount}</h3>
            <label>Module Title <span class="required">*</span></label>
            <input type="text" name="module_title[]" placeholder="Enter module title">

            <div class="contents-wrapper"></div>
            <button type="button" class="btn add-content">+ Add Content</button>
            <button type="button" class="remove-btn remove-module">Remove Module</button>
          </div>`;
        $("#modules-wrapper").append(moduleHTML);
    });

    $(document).on("click", ".add-content", function (e) {
        e.preventDefault();
        let contentHTML = `
          <div class="content">
            <label>Content Title <span class="required">*</span></label>
            <input type="text" name="content_title[]" placeholder="Enter content title">

            <label>Type</label>
            <select name="content_type[]">
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>

            <label>Details</label>
            <div class="details-field">
              <input type="text" name="content_details[]" placeholder="Enter details">
            </div>

            <button type="button" class="remove-btn remove-content">Remove Content</button>
          </div>`;
        $(this).siblings(".contents-wrapper").append(contentHTML);
    });

    $(document).on("click", ".remove-module", function () {
        $(this).parent(".module").remove();
    });

    $(document).on("click", ".remove-content", function () {
        $(this).parent(".content").remove();
    });

    $("#course-form").on("submit", function (e) {
        e.preventDefault();

        $("input, select").removeClass("error-field");
        $("#error-messages, #success-message").remove();

        let errors = [];

        let courseTitle = $("#course-title").val().trim();
        if (courseTitle === "") {
            errors.push("⚠️ Course title is required.");
            $("#course-title").addClass("error-field");
        }

        if ($(".module").length === 0) {
            errors.push("⚠️ Add at least one module.");
        }

        $(".module").each(function (moduleIndex) {
            let moduleTitleInput = $(this).find("input[name='module_title[]']");
            if (moduleTitleInput.val().trim() === "") {
                errors.push(`⚠️ Module ${moduleIndex + 1} title is required.`);
                moduleTitleInput.addClass("error-field");
            }

            $(this).find(".content").each(function (contentIndex) {
                let contentTitleInput = $(this).find("input[name='content_title[]']");
                let contentType = $(this).find("select[name='content_type[]']").val();
                let detailsField = $(this).find("input[name='content_details[]']");

                if (contentTitleInput.val().trim() === "") {
                    errors.push(`⚠️ Content ${contentIndex + 1} in Module ${moduleIndex + 1} needs a title.`);
                    contentTitleInput.addClass("error-field");
                }

                if (contentType === "image" && detailsField[0].files.length === 0) {
                    errors.push(`⚠️ Upload an image for Content ${contentIndex + 1} in Module ${moduleIndex + 1}.`);
                    detailsField.addClass("error-field");
                }
            });
        });

        if (errors.length > 0) {
            let errorHtml = `<div id="error-messages">
                                <strong>Please fix these errors:</strong>
                                <ul>`;
            errors.forEach(err => {
                errorHtml += `<li>${err}</li>`;
            });
            errorHtml += `</ul></div>`;
            $(".container").prepend(errorHtml);
            return;
        }

        let formData = new FormData();
        formData.append('title', courseTitle);
        formData.append('description', $("#course-description").val());
        formData.append('category', $("#course-category").val());

        $(".module").each(function (moduleIndex) {
            formData.append(`modules[${moduleIndex}][title]`, $(this).find("input[name='module_title[]']").val());

            $(this).find(".content").each(function (contentIndex) {
                let contentType = $(this).find("select[name='content_type[]']").val();
                formData.append(`modules[${moduleIndex}][contents][${contentIndex}][title]`, $(this).find("input[name='content_title[]']").val());
                formData.append(`modules[${moduleIndex}][contents][${contentIndex}][type]`, contentType);

                if (contentType === "image") {
                    let fileInput = $(this).find("input[name='content_details[]']")[0];
                    if (fileInput.files.length > 0) {
                        formData.append(`modules[${moduleIndex}][contents][${contentIndex}][details]`, fileInput.files[0]);
                    }
                } else {
                    formData.append(`modules[${moduleIndex}][contents][${contentIndex}][details]`, $(this).find("input[name='content_details[]']").val());
                }
            });
        });

        $.ajax({
            url: "/courses",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $(".container").prepend(`<div id="success-message">✅ Course created successfully!</div>`);
                $("#course-form")[0].reset();
                $("#modules-wrapper").empty();
            },
            error: function (xhr) {
                $(".container").prepend(`<div id="error-messages">❌ Something went wrong. Please try again.</div>`);
            }
        });
    });
});
