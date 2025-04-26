from flask import Flask, jsonify, render_template, request
import sqlite3

app = Flask(__name__)
DATABASE = 'db/university.db'

@app.route('/')
def index():
    return render_template('index.html')

# ---------- STUDENTS ----------
@app.route('/api/add_student', methods=['POST'])
def add_student():
    try:
        data = request.get_json()
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Students (student_id, first_name, last_name, address, email)
                VALUES (?, ?, ?, ?, ?)
            ''', (data['student_id'], data['first_name'], data['last_name'], data['address'], data['email']))
            conn.commit()
        return jsonify({'message': 'Student added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/students', methods=['GET'])
def get_students():
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Students")
            rows = cursor.fetchall()
            students = [{
                'student_id': row[0],
                'first_name': row[1],
                'last_name': row[2],
                'address': row[3],
                'email': row[4]
            } for row in rows]
        return jsonify({'students': students})
    except Exception as e:
        return jsonify({'error': str(e)})

# ---------- COURSES ----------
@app.route('/api/add_course', methods=['POST'])
def add_course():
    try:
        data = request.get_json()
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Courses (course_rubric, course_number, course_name, course_credits)
                VALUES (?, ?, ?, ?)
            ''', (data['rubric'], data['number'], data['name'], data['credits']))
            conn.commit()
        return jsonify({'message': 'Course added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/courses', methods=['GET'])
def get_courses_by_rubric():
    try:
        rubric = request.args.get('rubric', '')
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Courses WHERE course_rubric=?", (rubric,))
            courses = cursor.fetchall()
            course_list = [{
                'rubric': c[0],
                'number': c[1],
                'name': c[2],
                'credits': c[3]
            } for c in courses]
        return jsonify({'courses': course_list})
    except Exception as e:
        return jsonify({'error': str(e)})

# ---------- SECTIONS ----------
@app.route('/api/add_section', methods=['POST'])
def add_section():
    try:
        data = request.get_json()
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Sections (section_id, course_rubric, course_number, semester, year)
                VALUES (?, ?, ?, ?, ?)
            ''', (data['section_id'], data['rubric'], data['number'], data['semester'], data['year']))
            conn.commit()
        return jsonify({'message': 'Section added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/sections', methods=['GET'])
def get_sections():
    try:
        rubric = request.args.get('rubric', '')
        number = request.args.get('number', '')
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Sections WHERE course_rubric=? AND course_number=?", (rubric, number))
            sections = cursor.fetchall()
            section_list = [{
                'rubric': s[0],
                'number': s[1],
                'section_id': s[2],
                'semester': s[3],
                'year': s[4]
            } for s in sections]
        return jsonify({'sections': section_list})
    except Exception as e:
        return jsonify({'error': str(e)})


# ---------- REGISTRATION ----------
@app.route('/api/register_student', methods=['POST'])
def register_student():
    try:
        data = request.get_json()
        student_id = data['student_id']
        course_rubric = data['course_rubric']
        course_number = data['course_number']
        section_id = data['section_id']
        semester = data['semester']
        year = data['year']

        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()

            # Validate that the section exists
            cursor.execute('''
                SELECT section_id FROM Sections
                WHERE course_rubric = ? AND course_number = ? AND section_id = ? AND semester = ? AND year = ?
            ''', (course_rubric, course_number, section_id, semester, year))
            match = cursor.fetchone()

            if not match:
                return jsonify({'error': 'Section not found for the given course and term'}), 400

            cursor.execute('''
                INSERT INTO Enrollment (student_id, course_rubric, course_number, section_id, semester, year)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (student_id, course_rubric, course_number, section_id, semester, year))
            conn.commit()

        return jsonify({'message': 'Student registered successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Student is already registered in this section'}), 400
    except Exception as e:
        return jsonify({'error': str(e)})


# ---------- SECTION STUDENTS ----------
@app.route('/api/section_students', methods=['GET'])
def section_students():
    try:
        rubric = request.args.get('rubric')
        number = request.args.get('number')
        section_id = request.args.get('section_id')
        semester = request.args.get('semester')
        year = request.args.get('year')

        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT s.student_id, s.first_name, s.last_name
                FROM Students s
                JOIN Enrollment e ON s.student_id = e.student_id
                JOIN Sections sec ON e.section_id = sec.section_id
                WHERE sec.course_rubric = ?
                  AND sec.course_number = ?
                  AND sec.section_id = ?
                  AND sec.semester = ?
                  AND sec.year = ?
            ''', (rubric, number, section_id, semester, year))
            students = cursor.fetchall()
            student_list = [{'student_id': s[0], 'first_name': s[1], 'last_name': s[2]} for s in students]
        return jsonify({'students': student_list})
    except Exception as e:
        return jsonify({'error': str(e)})


# ---------- STUDENT COURSES ----------
@app.route('/api/student_courses', methods=['GET'])
def student_courses():
    try:
        student_id = request.args.get('student_id', '')
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT DISTINCT c.course_rubric, c.course_number, c.course_name, e.section_id, s.semester, s.year
                FROM Enrollment e
                JOIN Sections s ON e.course_rubric = s.course_rubric
                    AND e.course_number = s.course_number
                    AND e.section_id = s.section_id
                    AND e.semester = s.semester
                    AND e.year = s.year
                JOIN Courses c ON s.course_rubric = c.course_rubric AND s.course_number = c.course_number
                WHERE e.student_id = ?
            ''', (student_id,))
            courses = cursor.fetchall()
            course_list = [{
                'rubric': c[0],
                'number': c[1],
                'name': c[2],
                'section_id': c[3],
                'semester': c[4],
                'year': c[5]
            } for c in courses]
        return jsonify({'courses': course_list})
    except Exception as e:
        return jsonify({'error': str(e)})


# ---------- ASSIGN GRADE ----------
@app.route('/api/assign_grade', methods=['POST'])
def assign_grade():
    try:
        data = request.get_json()
        student_id = data['student_id']
        rubric = data['rubric']
        number = data['number']
        section_id = data['section_id']
        semester = data['semester']
        year = data['year']
        grade = data['grade']

        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()

            # Validate the section exists
            cursor.execute('''
                SELECT section_id FROM Sections
                WHERE course_rubric = ? AND course_number = ? AND section_id = ? AND semester = ? AND year = ?
            ''', (rubric, number, section_id, semester, year))
            match = cursor.fetchone()

            if not match:
                return jsonify({'error': 'Section not found for given course, semester, and year'}), 400

            # Update the grade in Enrollment
            cursor.execute('''
                UPDATE Enrollment
                SET student_grade = ?
                WHERE student_id = ? AND course_rubric = ? AND course_number = ? AND section_id = ? AND semester = ? AND year = ?
            ''', (grade, student_id, rubric, number, section_id, semester, year))
            conn.commit()

        return jsonify({'message': 'Grade assigned successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})


# ---------- TRANSCRIPT ----------
@app.route('/api/transcript', methods=['GET'])
def transcript():
    try:
        student_id = request.args.get('student_id', '')
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT DISTINCT c.course_rubric, c.course_number, c.course_name, e.section_id, e.student_grade, s.semester, s.year
                FROM Enrollment e
                JOIN Sections s ON e.section_id = s.section_id
                    AND e.course_rubric = s.course_rubric
                    AND e.course_number = s.course_number
                JOIN Courses c ON s.course_rubric = c.course_rubric AND s.course_number = c.course_number
                WHERE e.student_id = ?
            ''', (student_id,))
            rows = cursor.fetchall()
            transcript_data = [{
                'rubric': r[0],
                'number': r[1],
                'name': r[2],
                'section_id': r[3],
                'grade': r[4] if r[4] is not None else "Not Assigned",
                'semester': r[5],
                'year': r[6]
            } for r in rows]
        return jsonify({'transcript': transcript_data})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
