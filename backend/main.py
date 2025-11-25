from flask import Flask, jsonify
from database import DatabaseManagement
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db = DatabaseManagement(
    host="localhost",
    user="root",
    password="017HarVin20",
    database="StudentDB"
)   
db.connect()


# for i in range(3):
#     fname = input("Fname: ")
#     mname = input("Mname: ")
#     if mname.strip() == "":
#         mname = None
#     lname = input("Lname: ")
#     age = int(input("Age: "))
#     grade = int(input("Grade: "))

#     db.insert_query((fname, mname, lname, age), grade)

# Display the Total Students
@app.route('/total_students')
def get_total_students():
    result = db.display_query()
    total_students = result[0] if result else 0
    return jsonify({"total": total_students})

# Get the top performing students
@app.route('/top_performing_students')
def top_students_route():
    result = db.get_top_students() or []
    print("Top students from DB:", result)  # <--- DEBUG
    students = [
        {"fname": r[0], "mname": r[1], "lname": r[2], "grade": r[3]}
        for r in result
    ]
    return jsonify(students)


    
if __name__ == '__main__':
    app.run(debug=True)