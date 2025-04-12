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
