import mysql.connector
from mysql.connector import Error

class DatabaseManagement:

    def __init__(self, host, user, password, database=None):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.cursor = None
        self.connection = None

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.connection.is_connected():
                self.cursor = self.connection.cursor(buffered=True)
                print("Database connected successfully")
                return True
        except Error as e:
            print(f"Database connection failed: {e}")
            self.connection = None
            return False

    def create_query(self, query, params=None):
        self.cursor.execute(query, params or ())
        self.connection.commit()
        print("okay")