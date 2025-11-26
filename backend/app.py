from flask import Flask, jsonify
from flask_cors import CORS
from db import DatabaseManagement
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

db = DatabaseManagement(
    host="localhost",
    user="root",
    password="017HarVin20",
    database="StudentDB"
)
db.connect()


@app.route('/total_students', methods=["GET"])
def get_total_students():
    try:
        cursor = db.connection.cursor()
        cursor.execute("SELECT COUNT(student_id) FROM students")
        result = cursor.fetchone()
        total_students = result[0] if result else 0
        return jsonify({"total": total_students}), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Database query failed"}), 500


# @app.route('/top_performing_students', methods=["GET"])
# def get_top_students():
#     cursor = db.connection.cursor(buffered=True)
#     cursor.execute('''
#                    SELECT CONCAT(s.fname, CASE WHEN s.mname IS NOT NULL AND s.mname != '' THEN CONCAT(' ', s.mname) ELSE '' END, ' ', s.lname) AS full_name,
#                    g.grade
#                    FROM students s
#                    INNER JOIN grades g
#                    ON s.student_id = g.student_id
#                    ORDER BY g.grade DESC
#                    ''')
#     result = cursor.fetchall()
#     top_students = [
#                         {
#                             "full_name": row[0],
#                             "grade": row[1]
#                         }
#                         for row in result
#                     ]
#     return jsonify({"top_students": top_students})



if __name__ == "__main__":
    app.run(debug=True)