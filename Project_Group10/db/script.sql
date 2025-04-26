DROP VIEW IF EXISTS StudentTranscript;

DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Students;

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
    course_rubric TEXT,
    course_number INTEGER,
    section_id INTEGER,
    semester TEXT,
    year INTEGER,
    PRIMARY KEY (course_rubric, course_number, section_id, semester, year),
    FOREIGN KEY (course_rubric, course_number) REFERENCES Courses(course_rubric, course_number)
);

CREATE TABLE IF NOT EXISTS Enrollment (
    student_id INTEGER,
    course_rubric TEXT,
    course_number INTEGER,
    section_id INTEGER,
    semester TEXT,
    year INTEGER,
    student_grade TEXT, 
    PRIMARY KEY (student_id, course_rubric, course_number, section_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_rubric, course_number, section_id, semester, year) REFERENCES Sections(course_rubric, course_number, section_id, semester, year)
);

CREATE VIEW StudentTranscript AS
SELECT
    s.student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    c.course_rubric,
    c.course_number,
    c.course_name,
    e.student_grade
FROM Enrollment e
JOIN Students s ON e.student_id = s.student_id
JOIN Sections sec ON e.section_id = sec.section_id
JOIN Courses c ON sec.course_rubric = c.course_rubric AND sec.course_number = c.course_number;
