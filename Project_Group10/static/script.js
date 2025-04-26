// -------------- Students --------------
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

    console.log(`This query is executed: INSERT INTO Students (student_id, first_name, last_name, address, email) VALUES (${student.student_id}, ${student.first_name}, ${student.last_name}, ${student.address}, ${student.email})`);
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
                <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Address</th><th>Email</th></tr></thead><tbody>`;

            data.students.forEach(s => {
                html += `<tr><td>${s.student_id}</td><td>${s.first_name}</td><td>${s.last_name}</td><td>${s.address}</td><td>${s.email}</td></tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        });

    console.log('This query was executed: SELECT * FROM Students');
}

// -------------- Courses --------------
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

    console.log(`This query is executed: INSERT INTO Courses (course_rubric, course_number, course_name, course_credits) VALUES (${course.rubric}, ${course.number}, ${course.name}, ${course.credits})`);
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
                <thead><tr><th>Rubric</th><th>Number</th><th>Name</th><th>Credits</th></tr></thead><tbody>`;

            data.courses.forEach(c => {
                html += `<tr><td>${c.rubric}</td><td>${c.number}</td><td>${c.name}</td><td>${c.credits}</td></tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        });

    console.log(`This query was executed: SELECT * FROM Courses WHERE course_rubric=${rubric}`);
}

// -------------- Sections --------------
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

    console.log(`This query is executed: INSERT INTO Sections (section_id, course_rubric, course_number, semester, year) VALUES (${section.section_id}, ${section.rubric}, ${section.number}, ${section.semester}, ${section.year})`);
}

function fetchSections() {
    const rubric = document.getElementById('sectionSearchRubric').value;
    const number = document.getElementById('sectionSearchNumber').value;

    fetch(`/api/sections?rubric=${rubric}&number=${number}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const container = document.getElementById('sectionList');
        if (data.sections.length === 0) {
            container.innerHTML = '<p>No sections found.</p>';
            return;
        }

        // Group sections by "semester year"
        const grouped = {};
        data.sections.forEach(s => {
            const key = `${s.semester} ${s.year}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(s.section_id);
        });

        // Build HTML
        let html = `<h4>Sections for ${rubric} ${number}</h4>`;

        for (const [term, sectionIds] of Object.entries(grouped)) {
            html += `<h5 class="mt-4">${term}</h5><table class="table table-bordered">
                <thead><tr><th>Section ID</th></tr></thead><tbody>`;

            sectionIds.forEach(id => {
                html += `<tr><td>${id}</td></tr>`;
            });

            html += `</tbody></table>`;
        }

        container.innerHTML = html;
    })
    .catch(error => {
        alert('Error: ' + error.message);
        console.error('Error:', error);
    });

    console.log(`Fetching sections for rubric=${rubric} number=${number}`);
}


// -------------- Register Student --------------
function registerStudent() {
    const student_id = document.getElementById('regStudentId').value;
    const course_rubric = document.getElementById('regCourseRubric').value;
    const course_number = document.getElementById('regCourseNumber').value;
    const section_id = document.getElementById('regSectionId').value;
    const semester = document.getElementById('regSemester').value;
    const year = document.getElementById('regYear').value;

    fetch('/api/register_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            student_id: student_id,
            course_rubric: course_rubric,
            course_number: course_number,
            section_id: section_id,
            semester: semester,
            year: year
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Unknown response from server.');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });

    console.log(`Registering student ${student_id} to course ${course_rubric} ${course_number} section ${section_id} semester ${semester} year ${year}`);
}


// -------------- View Students in Section --------------
function getStudentsInSection() {
    const rubric = document.getElementById('viewSectionRubric').value;
    const number = document.getElementById('viewSectionNumber').value;
    const section_id = document.getElementById('viewSectionId').value;
    const semester = document.getElementById('viewSemester').value;
    const year = document.getElementById('viewYear').value;

    fetch(`/api/section_students?rubric=${rubric}&number=${number}&section_id=${section_id}&semester=${semester}&year=${year}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const container = document.getElementById('studentsInSection');
        if (data.students.length === 0) {
            container.innerHTML = '<p>No students found for this section.</p>';
            return;
        }

        let html = `<h4>Students in Section ${section_id}</h4><table class="table table-bordered">
            <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th></tr></thead><tbody>`;

        data.students.forEach(s => {
            html += `<tr><td>${s.student_id}</td><td>${s.first_name}</td><td>${s.last_name}</td></tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });

    console.log(`Fetching students for section: rubric=${rubric}, number=${number}, section_id=${section_id}, semester=${semester}, year=${year}`);
}


// -------------- View Courses for Student --------------
function getCoursesForStudent() {
    const student_id = document.getElementById('viewStudentId').value;

    fetch(`/api/student_courses?student_id=${student_id}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const container = document.getElementById('coursesForStudent');
        if (data.courses.length === 0) {
            container.innerHTML = '<p>No courses found for this student.</p>';
            return;
        }

        let html = `<h4>Courses for Student ${student_id}</h4><table class="table table-bordered">
            <thead><tr>
            <th>Rubric</th><th>Number</th><th>Name</th><th>Section ID</th><th>Semester</th><th>Year</th>
            </tr></thead><tbody>`;

        data.courses.forEach(c => {
            html += `<tr>
                <td>${c.rubric}</td>
                <td>${c.number}</td>
                <td>${c.name}</td>
                <td>${c.section_id}</td>
                <td>${c.semester}</td>
                <td>${c.year}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    })
    .catch(error => {
        alert('Error occurred: ' + error.message);
        console.error('Error:', error);
    });

    console.log(`Fetching courses for student_id=${student_id}`);
}


// -------------- Assign Grade --------------
function assignGrade() {
    const studentId = document.getElementById('gradeStudentId').value;
    const rubric = document.getElementById('gradeRubric').value;
    const number = document.getElementById('gradeNumber').value;
    const sectionId = document.getElementById('gradeSectionId').value;
    const semester = document.getElementById('gradeSemester').value;
    const year = document.getElementById('gradeYear').value;
    const grade = document.getElementById('studentGrade').value;

    fetch('/api/assign_grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            student_id: studentId,
            rubric: rubric,
            number: number,
            section_id: sectionId,
            semester: semester,
            year: year,
            grade: grade
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Unknown response from server.');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });

    console.log(`Assign grade: student_id=${studentId}, rubric=${rubric}, number=${number}, section_id=${sectionId}, semester=${semester}, year=${year}, grade=${grade}`);
}


// -------------- Generate Transcript --------------
function getTranscript() {
    const student_id = document.getElementById('transcriptStudentId').value;

    fetch(`/api/transcript?student_id=${student_id}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const container = document.getElementById('transcriptResult');
        if (data.transcript.length === 0) {
            container.innerHTML = '<p>No transcript data found for this student.</p>';
            return;
        }

        // Group by year+semester
        const grouped = {};
        data.transcript.forEach(t => {
            const key = `${t.year} ${t.semester}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(t);
        });

        let html = `<h4>Transcript for Student ${student_id}</h4>`;

        for (const [term, courses] of Object.entries(grouped)) {
            html += `<h5 class="mt-4">${term}</h5>
            <table class="table table-bordered">
            <thead><tr><th>Rubric</th><th>Number</th><th>Name</th><th>Section ID</th><th>Grade</th></tr></thead><tbody>`;

            courses.forEach(c => {
                html += `<tr>
                    <td>${c.rubric}</td>
                    <td>${c.number}</td>
                    <td>${c.name}</td>
                    <td>${c.section_id}</td>
                    <td>${c.grade}</td>
                </tr>`;
            });

            html += `</tbody></table>`;
        }

        container.innerHTML = html;
    })
    .catch(error => {
        alert('Error occurred: ' + error.message);
        console.error('Error:', error);
    });

    console.log(`Fetching transcript for student_id=${student_id}`);
}
