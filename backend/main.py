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
#     fname = input("Name: ")
#     mname = input("Mid Name: ")
#     if mname.strip() == "":
#         mname = None
#     lname = input("Lname: ")
#     age = int(input("Age: "))

#     students = (fname, mname, lname, age)
#     db.insert_query(students)

@app.route('/total_students')
def get_total_students():
    result = db.display_query()
    total_students = result[0] if result else 0
    return jsonify({"total": total_students})

if __name__ == '__main__':
    app.run(debug=True)