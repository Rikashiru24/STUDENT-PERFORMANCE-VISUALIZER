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
    
    def create_table(self):
        try:
            self.cursor.execute("""CREATE TABLE IF NOT EXISTS students (
                                        student_id INT PRIMARY KEY AUTO_INCREMENT,
                                        fname VARCHAR(50) NOT NULL,
                                        mname VARCHAR(50),
                                        lname VARCHAR(50) NOT NULL,
                                        age INT
                                )""")
        except Error as e:
            print(f"Table created!")
    
    def insert_query(self, val):
        try:
            self.cursor.execute("INSERT INTO students (fname, mname, lname, age) VALUES (%s, %s, %s, %s)", val)
            self.connection.commit()
            print(f"Inserted: {val}")
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