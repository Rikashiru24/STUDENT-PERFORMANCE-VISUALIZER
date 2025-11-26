from flask import Flask, jsonify
from flask_cors import CORS
from mysql.connector import Error
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="017HarVin20",
        database="StudentDB"
    )

@app.route('/total_students', methods=["GET"])
def get_total_students():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(student_id) FROM students")
        result = cursor.fetchone()
        cursor.close()
        db.close()
        total_students = result[0] if result else 0
        return jsonify({"total": total_students}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_grade_average', methods=["GET"])
def get_grade_average():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT ROUND(AVG(grade), 2) FROM grades")
        result = cursor.fetchone()
        cursor.close()
        db.close()
        total_average = result[0] if result else 0
        return jsonify({"totalAverage": total_average}), 200
    except Error as e:
        print(f"Error: {e}")
    
@app.route('/top_performing_students', methods=["GET"])
def get_top_students():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute('''
                       SELECT CONCAT(s.fname, CASE WHEN s.mname IS NOT NULL AND s.mname != '' THEN CONCAT(' ', s.mname) ELSE '' END, ' ', s.lname) AS full_name, g.grade AS grade
                       FROM students s
                       INNER JOIN grades g
                       ON s.student_id=g.student_id
                       ORDER BY g.grade DESC
                       LIMIT 10
                       ''')
        result = cursor.fetchall()
        cursor.close()
        db.close()
        top_students = [{"full_name": row[0], "grade": row[1]} for row in result]
        return jsonify({"students": top_students}), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Database query failed"}), 500

if __name__ == "__main__":
    app.run(debug=True)