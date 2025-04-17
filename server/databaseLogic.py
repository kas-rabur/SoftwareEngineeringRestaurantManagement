# database.py
import sqlite3

def connect_db():
    return sqlite3.connect('database.db')

def create_reservation(customer_id, date, time, table_number, status):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO Reservations (customer_id, reservation_date, reservation_time, table_number, status)
        VALUES (?, ?, ?, ?, ?)
    ''', (customer_id, date, time, table_number, status))
    conn.commit()
    conn.close()


def register_customer(name, contact, email, password):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO Person (name, contact, email, password)
            VALUES (?, ?, ?, ?)
        ''', (name, contact, email, password))
        conn.commit()
        return "User registered successfully"
    except sqlite3.IntegrityError:
        return "User already exists"
    finally:
        conn.close()

def login_customer(email, password):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM Person WHERE email = ? AND password = ?
    ''', (email, password))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return "Login successful"
    else:
        return "Invalid email or password"

def get_all_tables_with_status(date, time):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT table_id FROM Reservations
        WHERE reservation_date = ? AND reservation_time = ? AND status = 'confirmed'
    ''', (date, time))
    reserved = set(row[0] for row in cursor.fetchall())

    cursor.execute('''
        SELECT table_id, capacity FROM TableInfo
    ''')
    tables = cursor.fetchall()
    conn.close()

    return [
        {
            "table_id": table[0],
            "capacity": table[1],
            "available": table[0] not in reserved
        }
        for table in tables
    ]


