# database.py
import sqlite3

def connect_db():
    return sqlite3.connect('database.db')

def create_reservation(customer_email, date, time, table_number, status):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO Reservations (customer_email, reservation_date, reservation_time, table_id, status)
        VALUES (?, ?, ?, ?, ?)
    ''', (customer_email, date, time, table_number, status))
    conn.commit()
    conn.close()


def register_customer(name, contact, email, password):
    conn = connect_db()
    cursor = conn.cursor()
    role = "customer"  # default role for new users
    try:
        cursor.execute('''
            INSERT INTO Person (name, contact, email, password, role)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, contact, email, password, role))
        conn.commit()
        return "User registered successfully"
    except sqlite3.IntegrityError:
        return "User already exists"
    finally:
        conn.close()

def login_user(email, password):
    conn = connect_db()
    conn.row_factory = sqlite3.Row  
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM Person WHERE email = ? AND password = ?
    ''', (email, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    else:
        return None

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

def make_reservation(customer_email, reservation_date, reservation_time, table_id):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO Reservation (customer_email, reservation_date, reservation_time, table_id, status) 
        VALUES (?, ?, ?, ?, ?)
''', (customer_email, reservation_date, reservation_time, table_id, "confirmed"))
    
    conn.commit()
    conn.close()

def get_reservations(email):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT reservation_date, reservation_time, table_id
        FROM Reservations
        WHERE customer_email = (?)
    ''', (email,)) 

    reservations = cursor.fetchall()

    cursor.close()
    conn.close()
    
    return reservations

def get_menu_items():
    conn = connect_db()
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM Menu')
    rows = cursor.fetchall()

    #convert to list of dictionaries
    items = [dict(row) for row in rows]

    cursor.close()
    conn.close()
    return items

def get_customer_emails():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM Person WHERE role = 'user'")
    emails = [row[0] for row in cursor.fetchall()]
    print(f"customer emails: {emails}")
    conn.close()
    return emails

def get_table_numbers():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT table_id FROM TableInfo")
    tables = [row[0] for row in cursor.fetchall()]
    print(tables)
    conn.close()
    return tables