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
            # Close existing connection if any
            if self.connection and self.connection.is_connected():
                self.close()
                
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            self.cursor = self.connection.cursor(buffered=True)
            print(f"Connected to database: {self.database or 'Mysql server'}")
            return True
        except Error as e:
            print(f"Error connecting to database: {e}")
            return False
    
    def close(self):
        """Close database connection properly"""
        try:
            if self.cursor:
                self.cursor.close()
                self.cursor = None
            if self.connection and self.connection.is_connected():
                self.connection.close()
                self.connection = None
            print("Database connection closed")
        except Error as e:
            print(f"Error closing connection: {e}")
    
    def ensure_connection(self):
        """Ensure we have an active connection"""
        if not self.connection or not self.connection.is_connected():
            return self.connect()
        return True
    
    def create_database(self, db_name):
        try:
            if self.ensure_connection():
                self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
                print(f"Database '{db_name}' created.")
        except Error as e:
            print(f"Failed to create database: {e}")
    
    def create_table(self, query, params=None):
        try:
            if self.ensure_connection():
                self.cursor.execute(query, params or ())
                self.connection.commit()
                print("Table Created!")
        except Error as e:
            print(f"Table NOT Created! {e}")
    
    def insert_query(self, val, grade=None):
        try:
            if self.ensure_connection():
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
            if self.ensure_connection():
                self.cursor.execute("SELECT COUNT(student_id) FROM students")
                result = self.cursor.fetchone()
                return result
        except Error as e:
            print(f"Error fetching data: {e}")
            return None
    
    def get_top_students(self):
        try:
            if self.ensure_connection():
                # Use the existing cursor instead of creating a new one
                self.cursor.execute("""
                    SELECT CONCAT(s.fname,
                                    CASE WHEN s.mname IS NOT NULL AND s.mname != '' THEN CONCAT(' ', s.mname) ELSE '' END,
                                    ' ', s.lname) AS full_name, g.grade
                    FROM students s 
                    INNER JOIN grades g 
                    ON s.student_id = g.student_id
                    ORDER BY g.grade DESC
                """)
                result = self.cursor.fetchall()
                return result
        except Error as e:
            print(f"Error Inner Join: {e}")
            return []