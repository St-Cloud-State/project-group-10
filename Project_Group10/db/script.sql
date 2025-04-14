CREATE TABLE IF NOT EXISTS Students (
    student_id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    address TEXT,
    email TEXT
);

CREATE TABLE IF NOT EXISTS Courses (
    course_rubric TEXT,
    course_number INTEGER,
    course_name TEXT,
    course_credits INTEGER,
    PRIMARY KEY (course_rubric, course_number)
);

CREATE TABLE IF NOT EXISTS Sections (
    section_id INTEGER PRIMARY KEY,
    course_rubric TEXT,
    course_number INTEGER,
    semester TEXT,
    year INTEGER,
    FOREIGN KEY (course_rubric, course_number) REFERENCES Courses(course_rubric, course_number)
)