function addStudent() {
    const student = {
        student_id: document.getElementById('studentId').value,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value
    };

    fetch('/api/add_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
    });

    console.log(`This query is executed: INSERT INTO Students (student_id, first_name, last_name, address, email)
            VALUES (${student.student_id}, ${student.first_name},${student.last_name}, ${student.address}, ${student.email}) `)
}

function fetchStudents() {
    fetch('/api/students')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('studentList');
            if (data.students.length === 0) {
                container.innerHTML = '<p>No students found.</p>';
                return;
            }

            let html = `<h4>All Students</h4><table class="table table-bordered">
                <thead><tr>
                    <th>ID</th><th>First Name</th><th>Last Name</th><th>Address</th><th>Email</th>
                </tr></thead><tbody>`;

            data.students.forEach(s => {
                html += `<tr>
                    <td>${s.student_id}</td>
                    <td>${s.first_name}</td>
                    <td>${s.last_name}</td>
                    <td>${s.address}</td>
                    <td>${s.email}</td>
                </tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        });

    console.log('This query was executed: SELECT * FROM Students');
}


// ----------- Courses -----------
function addCourse() {
    const course = {
        rubric: document.getElementById('courseRubric').value,
        number: document.getElementById('courseNumber').value,
        name: document.getElementById('courseName').value,
        credits: document.getElementById('courseCredits').value
    };

    fetch('/api/add_course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
    });

        console.log(`This query is executed: INSERT INTO Courses (course_rubric, course_number, course_name, course_credits)
            VALUES (${course.rubric}, ${course.number},${course.name}, ${course.credits}`);
}

function fetchCoursesByRubric() {
    const rubric = document.getElementById('searchRubric').value;
    fetch(`/api/courses?rubric=${rubric}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('courseList');
            if (data.courses.length === 0) {
                container.innerHTML = '<p>No courses found.</p>';
                return;
            }

            let html = `<h4>Courses for Rubric: ${rubric}</h4><table class="table table-bordered">
                <thead><tr>
                    <th>Rubric</th><th>Number</th><th>Name</th><th>Credits</th>
                </tr></thead><tbody>`;

            data.courses.forEach(c => {
                html += `<tr>
                    <td>${c.rubric}</td>
                    <td>${c.number}</td>
                    <td>${c.name}</td>
                    <td>${c.credits}</td>
                </tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        });
    
        console.log(`This query was executed: SELECT * FROM Courses WHERE course_rubric=${rubric}`);
}


// ----------- Sections -----------
function addSection() {
    const section = {
        section_id: document.getElementById('sectionId').value,
        rubric: document.getElementById('sectionRubric').value,
        number: document.getElementById('sectionNumber').value,
        semester: document.getElementById('semester').value,
        year: document.getElementById('year').value
    };

    fetch('/api/add_section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
    });

    console.log(`This query is executed:  INSERT INTO Sections (section_id, course_rubric, course_number, semester, year)
        VALUES (${section.section_id}, ${section.rubric},${section.number}, ${section.semester}, ${section.year}`);
}

function fetchSections() {
    const rubric = document.getElementById('sectionSearchRubric').value;
    const number = document.getElementById('sectionSearchNumber').value;

    fetch(`/api/sections?rubric=${rubric}&number=${number}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('sectionList');
            if (data.sections.length === 0) {
                container.innerHTML = '<p>No sections found.</p>';
                return;
            }

            let html = `<h4>Sections for ${rubric} ${number}</h4><table class="table table-bordered">
                <thead><tr>
                    <th>Section ID</th><th>Semester</th><th>Year</th>
                </tr></thead><tbody>`;

            data.sections.forEach(s => {
                html += `<tr>
                    <td>${s.section_id}</td>
                    <td>${s.semester}</td>
                    <td>${s.year}</td>
                </tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        });
        console.log(`This query was executed: SELECT * FROM Sections WHERE course_rubric=${rubric} AND course_number=${number}}`);
}

