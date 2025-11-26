from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

def get_db_connection():
    """Create a new database connection for each request"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='017HarVin20',
            database='StudentDB',
            autocommit=True
        )
        return connection
    except Error as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/total_students')
def get_total_students():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(buffered=True)
            cursor.execute("SELECT COUNT(student_id) FROM students")
            result = cursor.fetchone()
            total_students = result[0] if result else 0
            return jsonify({"total": total_students})
        except Error as e:
            print(f"Query error: {e}")
            return jsonify({"error": "Database query failed"}), 500
        finally:
            cursor.close()
            conn.close()
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/top_performing_students')
def top_students_route():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(buffered=True)
            cursor.execute("""
                SELECT CONCAT(s.fname,
                                CASE WHEN s.mname IS NOT NULL AND s.mname != '' THEN CONCAT(' ', s.mname) ELSE '' END,
                                ' ', s.lname) AS full_name, g.grade
                FROM students s 
                INNER JOIN grades g ON s.student_id = g.student_id
                ORDER BY g.grade DESC
            """)
            result = cursor.fetchall()
            students = [
                {"full_name": row[0], "grade": row[1]}
                for row in result
            ]
            return jsonify({"students": students}), 200
        except Error as e:
            print(f"Query error: {e}")
            return jsonify({"error": "Database query failed"}), 500
        finally:
            cursor.close()
            conn.close()
    return jsonify({"error": "Database connection failed"}), 500

if __name__ == "__main__":
    # Test connection first
    test_conn = get_db_connection()
    if test_conn:
        print("Database connection successful! Starting server...")
        test_conn.close()
        app.run(debug=True, use_reloader=False)
    else:
        print("Failed to connect to database. Please check your credentials.")