import sqlite3
import bcrypt

DB_PATH = 'database.db'

def connect_db():
    return sqlite3.connect(DB_PATH)

def create_reservation(customer_email, date, time, table_number, status):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Reservations (customer_email, reservation_date, reservation_time, table_id, status) VALUES (?, ?, ?, ?, ?)",
        (customer_email, date, time, table_number, status)
    )
    conn.commit()
    conn.close()

def register_customer(name, contact, email, password):
    conn = connect_db()
    cursor = conn.cursor()

    pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    print("hashed password:", repr(pw_hash))
    print("type:", type(pw_hash))


    try:
        cursor.execute(
            "INSERT INTO Person (name, contact, email, password, role) "
            "VALUES (?, ?, ?, ?, ?)",
            (name, contact, email, pw_hash, "user")
        )
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

    cursor.execute(
        "SELECT id, name, email, role, password FROM Person WHERE email = ?",
        (email,)
    )


    user = cursor.fetchone()#
    print("raw password from DB:", repr(user["password"]))
    print("type:", type(user["password"]))
    conn.close()

    if not user:
        return None

    stored_hash = user["password"]           
    
    if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
        return {
            "id":    user["id"],
            "name":  user["name"],
            "email": user["email"],
            "role":  user["role"],
        }

    return None

def get_all_tables_with_status(date, time):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT table_id FROM Reservations WHERE reservation_date = ? AND reservation_time = ? AND status = 'confirmed'",
        (date, time)
    )
    reserved = {row[0] for row in cursor.fetchall()}
    cursor.execute("SELECT table_id, capacity FROM TableInfo")
    tables = cursor.fetchall()
    conn.close()
    return [
        {"table_id": t[0], "capacity": t[1], "available": t[0] not in reserved}
        for t in tables
    ]

def make_reservation(customer_email, reservation_date, reservation_time, table_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Reservation (customer_email, reservation_date, reservation_time, table_id, status) VALUES (?, ?, ?, ?, ?)",
        (customer_email, reservation_date, reservation_time, table_id, "confirmed")
    )
    conn.commit()
    conn.close()

def get_reservations(email):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT reservation_date, reservation_time, table_id FROM Reservations WHERE customer_email = ?",
        (email,)
    )
    reservations = cursor.fetchall()
    conn.close()
    return reservations

def get_all_reservations():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Reservations")
    reservations = cursor.fetchall()
    conn.close()
    return reservations

def get_menu_items():
    conn = connect_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Menu")
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return items

def get_customer_emails():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM Person WHERE role = 'user'")
    emails = [row[0] for row in cursor.fetchall()]
    conn.close()
    return emails

def get_table_numbers():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT table_id FROM TableInfo")
    tables = [row[0] for row in cursor.fetchall()]
    conn.close()
    return tables

def make_order(email, table_id, items, amount, order_date, order_time):
    try:
        conn = connect_db()
        cursor = conn.cursor()
        rounded_amount = round(amount, 2)
        cursor.execute(
            "INSERT INTO Orders (email, table_number, items, total_amount, status, order_date, order_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (email, table_id, items, rounded_amount, "pending", order_date, order_time)
        )
        conn.commit()
        return "Order placed successfully"
    except Exception as e:
        return f"Error placing order: {e}"
    finally:
        conn.close()

def get_all_orders():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT order_id, email, table_number, items, total_amount, status, order_date, order_time
        FROM Orders
    """)
    orders = cursor.fetchall()
    conn.close()
    return orders
