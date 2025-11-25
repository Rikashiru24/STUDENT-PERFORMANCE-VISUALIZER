import mysql.connector
from mysql.connector import Error


class DatabaseManagement:

    def __init__(self, host, user, password, database=None):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
        self.cursor = None
    
    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host = self.host,
                user = self.user,
                password = self.password,
                database = self.database
            )
            self.cursor = self.connection.cursor(buffered=True)
            print(f"Connected to database: {self.database or 'Mysql server'}")
        except Error as e:
            print(f"Error: {e}")
    
    def create_database(self, db_name):
        try:
            self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            print(f"Database '{db_name}' created.")
        except Error as e:
            print(f"Failed to create database: {e}")
    
    def create_table(self, query, params=None):
        try:
            self.cursor.execute(query, params or ())
            self.connection.commit()
            print("Table Created!")
        except Error as e:
            print(f"Table NOT Created! {e}")
    
    def insert_query(self, val, grade=None):
        try:
            self.cursor.execute("INSERT INTO students (fname, mname, lname, age) VALUES (%s, %s, %s, %s)", val)
            self.connection.commit()

            student_id = self.cursor.lastrowid

            self.cursor.execute("INSERT INTO grades (student_id, grade) VALUES (%s, %s)", (student_id, grade))
            self.connection.commit()

            print(f"Inserted student {val} with student_id={student_id}")
        except Error as e:
            print(f"Not Inserted: {e}")

    def display_query(self):
        try:
            self.cursor.execute("SELECT COUNT(student_id) FROM students")
            result = self.cursor.fetchone()
            return result
        except Error as e:
            print(f"Error fetching data: {e}")
            return None
    
    def get_top_students(self):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT s.fname, s.mname, s.lname, g.grade
                    FROM students s 
                    INNER JOIN grades g
                    ON s.student_id = g.student_id
                """)
                result = cursor.fetchall()
                return result
        except Error as e:
            print(f"Erro Inner Join: {e}")
            return []
