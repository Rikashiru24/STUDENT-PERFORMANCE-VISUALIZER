from datetime import datetime, timedelta
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

# API GRADE AVERAGE
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

# API ATTENDANCE RATE
@app.route('/attendance_rate', methods=["GET"])
def get_attendance_rate():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("""SELECT ROUND(AVG(a.present / (a.present + a.absent)) * 100, 2) AS overall_attendance_rate_percentage
                    FROM attendance a
                    """)
        result = cursor.fetchone()
        cursor.close()
        db.close()
        attendance_rate = result[0] if result else 0
        return jsonify({"attendance": attendance_rate}), 200
    except Error as e:
        print(f"Erro fetching attendace rate: {e}")
    
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

@app.route('/api/grade_distribution', methods=["GET"])
def grade_distribution():
    """API for grade distribution using actual database data"""
    try:
        # Query your database for grade distribution
        db = get_db_connection()
        cursor = db.cursor()
        # Count students in each grade range
        query = """
        SELECT 
            SUM(CASE WHEN grade >= 90 THEN 1 ELSE 0 END) as A,
            SUM(CASE WHEN grade >= 80 AND grade < 90 THEN 1 ELSE 0 END) as B,
            SUM(CASE WHEN grade >= 70 AND grade < 80 THEN 1 ELSE 0 END) as C,
            SUM(CASE WHEN grade >= 60 AND grade < 70 THEN 1 ELSE 0 END) as D,
            SUM(CASE WHEN grade < 60 THEN 1 ELSE 0 END) as F
        FROM grades
        """
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        
        grade_counts = {
            'A': result[0] or 0,
            'B': result[1] or 0,
            'C': result[2] or 0,
            'D': result[3] or 0,
            'F': result[4] or 0
        }
        
        return jsonify({
            'success': True,
            'data': {
                'labels': ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (Below 60)'],
                'datasets': [{
                    'label': 'Number of Students',
                    'data': [
                        grade_counts['A'],
                        grade_counts['B'],
                        grade_counts['C'],
                        grade_counts['D'],
                        grade_counts['F']
                    ],
                    'backgroundColor': [
                        '#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'
                    ],
                    'borderColor': [
                        '#45a049', '#7cb342', '#fbc02d', '#e68900', '#da190b'
                    ],
                    'borderWidth': 1
                }]
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
# Performance Trend API - Past to Present (No Future Projections)
@app.route('/api/performance_trend', methods=['GET'])
def performance_trend():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Get all unique dates with data from both tables
        cursor.execute("""
            SELECT DISTINCT DATE(created_at) as date
            FROM (
                SELECT created_at FROM grades 
                UNION ALL 
                SELECT created_at FROM attendance
            ) as all_dates
            ORDER BY date
        """)
        dates_with_data = [row['date'] for row in cursor.fetchall()]
        
        print(f"Dates with data: {dates_with_data}")
        
        if not dates_with_data:
            # No data found
            cursor.close()
            db.close()
            return jsonify({
                'success': True,
                'data': {
                    'labels': [],
                    'datasets': [
                        {
                            'label': 'Class Average',
                            'data': [],
                            'borderColor': '#2196F3',
                            'backgroundColor': 'rgba(33, 150, 243, 0.1)',
                            'tension': 0.3,
                            'fill': True,
                            'borderWidth': 2
                        },
                        {
                            'label': 'Attendance Rate',
                            'data': [],
                            'borderColor': '#4CAF50',
                            'backgroundColor': 'rgba(76, 175, 80, 0.1)',
                            'tension': 0.3,
                            'fill': True,
                            'borderWidth': 2
                        }
                    ]
                }
            })
        
        # Check if all data is from the same month
        first_date = dates_with_data[0]
        last_date = dates_with_data[-1]
        same_month = (first_date.year == last_date.year and first_date.month == last_date.month)
        
        if same_month and len(dates_with_data) > 1:
            # Multiple days in same month - show daily view
            return get_daily_view(cursor, db, dates_with_data)
        else:
            # Single day or multiple months - show monthly view
            return get_monthly_view(cursor, db, dates_with_data)
        
    except Exception as e:
        print(f"Error in performance_trend: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

def get_daily_view(cursor, db, dates_with_data):
    """Show daily data for current month"""
    # Get daily grade averages
    daily_grade_query = """
    SELECT 
        DATE(created_at) as date,
        AVG(grade) as average_grade
    FROM grades 
    GROUP BY DATE(created_at)
    ORDER BY date
    """
    cursor.execute(daily_grade_query)
    grade_results = {row['date'].strftime('%Y-%m-%d'): round(float(row['average_grade']), 2) for row in cursor.fetchall()}
    
    # Get daily attendance rates
    daily_attendance_query = """
    SELECT 
        DATE(created_at) as date,
        AVG((present / (present + absent)) * 100) as attendance_rate
    FROM attendance 
    GROUP BY DATE(created_at)
    ORDER BY date
    """
    cursor.execute(daily_attendance_query)
    attendance_results = {row['date'].strftime('%Y-%m-%d'): round(float(row['attendance_rate']), 2) for row in cursor.fetchall()}
    
    print(f"Daily grade data: {grade_results}")
    print(f"Daily attendance data: {attendance_results}")
    
    # Build the final data arrays
    labels = []
    class_averages = []
    attendance_rates = []
    
    for date in dates_with_data:
        date_str = date.strftime('%Y-%m-%d')
        # Convert to "Nov 27" format
        labels.append(date.strftime('%b %d'))
        
        # Add grade data if available for this date
        class_averages.append(grade_results.get(date_str))
        
        # Add attendance data if available for this date
        attendance_rates.append(attendance_results.get(date_str))
    
    print("Daily labels:", labels)
    print("Daily class averages:", class_averages)
    print("Daily attendance rates:", attendance_rates)
    
    cursor.close()
    db.close()
    
    return jsonify({
        'success': True,
        'data': {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Daily Class Average',
                    'data': class_averages,
                    'borderColor': '#2196F3',
                    'backgroundColor': 'rgba(33, 150, 243, 0.1)',
                    'tension': 0.3,
                    'fill': True,
                    'borderWidth': 2,
                    'pointBackgroundColor': '#2196F3'
                },
                {
                    'label': 'Daily Attendance Rate',
                    'data': attendance_rates,
                    'borderColor': '#4CAF50',
                    'backgroundColor': 'rgba(76, 175, 80, 0.1)',
                    'tension': 0.3,
                    'fill': True,
                    'borderWidth': 2,
                    'pointBackgroundColor': '#4CAF50'
                }
            ]
        }
    })

def get_monthly_view(cursor, db, dates_with_data):
    """Show monthly data"""
    # Get all unique months with data
    cursor.execute("""
        SELECT DISTINCT DATE_FORMAT(created_at, '%Y-%m') as month
        FROM (
            SELECT created_at FROM grades 
            UNION ALL 
            SELECT created_at FROM attendance
        ) as all_dates
        ORDER BY month
    """)
    months_with_data = [row['month'] for row in cursor.fetchall()]
    
    # Get monthly grade averages
    monthly_grade_query = """
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        AVG(grade) as average_grade
    FROM grades 
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month
    """
    cursor.execute(monthly_grade_query)
    grade_results = {row['month']: round(float(row['average_grade']), 2) for row in cursor.fetchall()}
    
    # Get monthly attendance rates
    monthly_attendance_query = """
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        AVG((present / (present + absent)) * 100) as attendance_rate
    FROM attendance 
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month
    """
    cursor.execute(monthly_attendance_query)
    attendance_results = {row['month']: round(float(row['attendance_rate']), 2) for row in cursor.fetchall()}
    
    # Build the final data arrays
    labels = []
    class_averages = []
    attendance_rates = []
    
    for month in months_with_data:
        # Convert "2025-11" to "November 2025"
        month_date = datetime.strptime(month, '%Y-%m')
        labels.append(month_date.strftime('%B %Y'))
        
        # Add grade data if available for this month
        class_averages.append(grade_results.get(month))
        
        # Add attendance data if available for this month
        attendance_rates.append(attendance_results.get(month))
    
    cursor.close()
    db.close()
    
    return jsonify({
        'success': True,
        'data': {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Class Average',
                    'data': class_averages,
                    'borderColor': '#2196F3',
                    'backgroundColor': 'rgba(33, 150, 243, 0.1)',
                    'tension': 0.3,
                    'fill': True,
                    'borderWidth': 2
                },
                {
                    'label': 'Attendance Rate',
                    'data': attendance_rates,
                    'borderColor': '#4CAF50',
                    'backgroundColor': 'rgba(76, 175, 80, 0.1)',
                    'tension': 0.3,
                    'fill': True,
                    'borderWidth': 2
                }
            ]
        }
    })
    
if __name__ == "__main__":
    app.run(debug=True)