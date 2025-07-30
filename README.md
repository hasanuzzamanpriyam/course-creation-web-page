## Course Creation Web App

A Laravel-based project that allows users to create courses with unlimited modules and unlimited content items (text, image, video, link).

This project demonstrates full-stack development using:

**Frontend**: HTML, CSS, JavaScript, jQuery

**Backend**: Laravel (PHP)

**Database**: MySQL

## Features 

✅ Course Creation – Add a course with title, description, and category.  
✅ Unlimited Modules – Each course can have as many modules as needed.  
✅ Unlimited Content Per Module – Add text, images, videos, or links.  
✅ Dynamic Form – Add/remove modules & contents dynamically using jQuery.  
✅ File Uploads – Upload images for content (stored in storage/app/public/uploads/images).  
✅ Frontend Validation – Instant feedback for required fields (red borders & inline error messages).  
✅ Backend Validation – Ensures data integrity, preventing invalid entries.  
✅ AJAX Form Submission – No page reload; smooth UX.  
✅ Error & Success Handling – Inline messages for user clarity.  

## Validation 
**🔹 Frontend Validation**  
✔ Course Title required  
✔ At least one Module required  
✔ Each Module Title required  
✔ Each Content Title required  
✔ If type = Image → File must be uploaded  

**➡ Invalid fields are highlighted in red & errors are shown inline.**  

**🔹 Backend Validation**  
✔ Laravel validates all requests again to prevent bypass.  
✔ Ensures type = image must include a file.  
✔ Prevents invalid/malicious data from being saved.  

## Tech Stack

**Laravel 11 (Backend & API)**  
**Blade (View templating)**  
**jQuery (Dynamic UI)**  
**Bootstrap (optional) for styling (or custom CSS)**  
**MySQL for database**  
**AJAX for seamless communication between frontend & backend**  
## Project Structure

CourseCreationPage/  
├── app/  
│   ├── Http/Controllers/CourseController.php  
│   ├── Models/Course.php  
│   ├── Models/Module.php  
│   ├── Models/Content.php  
├── database/migrations/  
│   ├── create_courses_table.php  
│   ├── create_modules_table.php  
│   ├── create_contents_table.php  
├── public/  
│   ├── css/style.css  
│   ├── js/main.js  
│   ├── storage -> storage/app/public (symlink)  
├── resources/views/courses/create.blade.php  
├── routes/web.php  
└── README.md  

## Setup Instructions

git clone https://github.com/your-username/CourseCreationPage.git  
cd CourseCreationPage  

## Install Dependencies  
composer install  

## Install Dependencies  
**Copy .env.example to .env**  
**php artisan key:generate**  
**php artisan migrate**  
**php artisan storage:link**  

## Run the Project  
**php artisan serve**  
