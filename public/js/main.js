$(document).ready(function () {
    let moduleCount = 0;

    /* Update "Details" field dynamically when type changes */
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

    /* Add Module */
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

    /* Add Content to a Module */
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

    /* Remove Module */
    $(document).on("click", ".remove-module", function () {
        $(this).parent(".module").remove();
    });

    /* Remove Content */
    $(document).on("click", ".remove-content", function () {
        $(this).parent(".content").remove();
    });

    /* Submit Course (Validations but NO alerts) */
    $("#submit-course").click(function () {
        // Clear previous error highlights and messages
        $("input, select").removeClass("error-field");
        $("#error-messages").remove();

        let errors = [];

        // Validate Course Title
        let courseTitle = $("#course-title").val().trim();
        if (courseTitle === "") {
            errors.push("⚠️ Course title is required.");
            $("#course-title").addClass("error-field");
        }

        // At least one module required
        if ($(".module").length === 0) {
            errors.push("⚠️ Add at least one module.");
        }

        // Validate each module & its contents
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

                // Content Title required
                if (contentTitleInput.val().trim() === "") {
                    errors.push(`⚠️ Content ${contentIndex + 1} in Module ${moduleIndex + 1} needs a title.`);
                    contentTitleInput.addClass("error-field");
                }

                // If Image type, file must be uploaded
                if (contentType === "image" && detailsField[0].files.length === 0) {
                    errors.push(`⚠️ Upload an image for Content ${contentIndex + 1} in Module ${moduleIndex + 1}.`);
                    detailsField.addClass("error-field");
                }
            });
        });

        // Show inline errors (NO popups)
        if (errors.length > 0) {
            let errorHtml = `<div id="error-messages" style="color:red; background:#ffe6e6; padding:10px; margin-bottom:10px; border:1px solid red; border-radius:5px;">
                                <strong>Please fix these errors:</strong>
                                <ul style="margin:5px 0;">`;
            errors.forEach(err => {
                errorHtml += `<li>${err}</li>`;
            });
            errorHtml += `</ul></div>`;
            $(".container").prepend(errorHtml);
            return;
        }

        // Build final course data (just console logging for now)
        let courseData = {
            title: courseTitle,
            description: $("#course-description").val(),
            category: $("#course-category").val(),
            modules: []
        };

        $(".module").each(function () {
            let moduleTitle = $(this).find("input[name='module_title[]']").val();
            let moduleObj = { title: moduleTitle, contents: [] };

            $(this).find(".content").each(function () {
                let contentObj = {
                    title: $(this).find("input[name='content_title[]']").val(),
                    type: $(this).find("select[name='content_type[]']").val(),
                    details: $(this).find("input[name='content_details[]']").val(),
                };
                moduleObj.contents.push(contentObj);
            });

            courseData.modules.push(moduleObj);
        });

        console.log(" Final Course Data:", courseData);
        // Here you’ll add AJAX call later (no alerts, just inline messages)
    });
});
