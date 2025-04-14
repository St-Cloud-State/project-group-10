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
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Students (student_id, first_name, last_name, address, email)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['student_id'], data['first_name'], data['last_name'], data['address'], data['email']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/students', methods=['GET'])
def get_students():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")
        rows = cursor.fetchall()
        conn.close()
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
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Courses (course_rubric, course_number, course_name, course_credits)
            VALUES (?, ?, ?, ?)
        ''', (data['rubric'], data['number'], data['name'], data['credits']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Course added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/courses', methods=['GET'])
def get_courses_by_rubric():
    try:
        rubric = request.args.get('rubric', '')
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Courses WHERE course_rubric=?", (rubric,))
        courses = cursor.fetchall()
        conn.close()
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
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Sections (section_id, course_rubric, course_number, semester, year)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['section_id'], data['rubric'], data['number'], data['semester'], data['year']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Section added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/sections', methods=['GET'])
def get_sections():
    try:
        rubric = request.args.get('rubric', '')
        number = request.args.get('number', '')
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Sections WHERE course_rubric=? AND course_number=?", (rubric, number))
        sections = cursor.fetchall()
        conn.close()
        section_list = [{
            'section_id': s[0],
            'rubric': s[1],
            'number': s[2],
            'semester': s[3],
            'year': s[4]
        } for s in sections]
        return jsonify({'sections': section_list})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
