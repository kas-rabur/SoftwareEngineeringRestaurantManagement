import sqlite3
import bcrypt
from contextlib import contextmanager

DB_PATH = 'database.db'

class Database:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self.conn = None

    def connect(self):
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        return self.conn

    def close(self):
        if self.conn:
            self.conn.close()
            self.conn = None

    @contextmanager
    def session(self):
        conn = self.connect()
        cursor = conn.cursor()
        try:
            yield cursor
            conn.commit()
        except:
            conn.rollback()
            raise
        finally:
            self.close()

    def create_reservation(self, customer_email, date, time, table_number, status):
        with self.session() as cur:
            cur.execute(
                "INSERT INTO Reservations (customer_email, reservation_date, reservation_time, table_id, status) VALUES (?, ?, ?, ?, ?)",
                (customer_email, date, time, table_number, status)
            )

    def register_customer(self, name, contact, email, password):
        pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        try:
            with self.session() as cur:
                cur.execute(
                    "INSERT INTO Person (name, contact, email, password, role) VALUES (?, ?, ?, ?, ?)",
                    (name, contact, email, pw_hash, "user")
                )
            return "User registered successfully"
        except sqlite3.IntegrityError:
            return "User already exists"

    def login_user(self, email, password):
        with self.session() as cur:
            cur.execute(
                "SELECT id, name, email, role, password FROM Person WHERE email = ?",
                (email,)
            )
            row = cur.fetchone()
        if row and bcrypt.checkpw(password.encode('utf-8'), row['password'].encode('utf-8')):
            return {"id": row["id"], "name": row["name"], "email": row["email"], "role": row["role"]}
        return None

    def get_all_tables_with_status(self, date, time):
        with self.session() as cur:
            cur.execute(
                "SELECT table_id FROM Reservations WHERE reservation_date = ? AND reservation_time = ? AND status = 'confirmed'",
                (date, time)
            )
            reserved = {r[0] for r in cur.fetchall()}
            cur.execute("SELECT table_id, capacity FROM TableInfo")
            tables = cur.fetchall()
        return [{"table_id": t["table_id"], "capacity": t["capacity"], "available": t["table_id"] not in reserved} for t in tables]

    def get_reservations(self, email):
        with self.session() as cur:
            cur.execute(
                "SELECT reservation_date, reservation_time, table_id FROM Reservations WHERE customer_email = ?",
                (email,)
            )
            return cur.fetchall()

    def get_all_reservations(self):
        with self.session() as cur:
            cur.execute("SELECT * FROM Reservations")
            return cur.fetchall()

    def get_menu_items(self):
        with self.session() as cur:
            cur.execute("SELECT * FROM Menu")
            return [dict(row) for row in cur.fetchall()]

    def get_customer_emails(self):
        with self.session() as cur:
            cur.execute("SELECT email FROM Person WHERE role = 'user'")
            return [row[0] for row in cur.fetchall()]

    def get_table_numbers(self):
        with self.session() as cur:
            cur.execute("SELECT table_id FROM TableInfo")
            return [row[0] for row in cur.fetchall()]

    def make_order(self, email, table_id, items, amount, order_date, order_time):
        try:
            with self.session() as cur:
                rounded = round(amount, 2)
                cur.execute(
                    "INSERT INTO Orders (email, table_number, items, total_amount, status, order_date, order_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (email, table_id, items, rounded, "pending", order_date, order_time)
                )
            return "Order placed successfully"
        except Exception as e:
            return f"Error placing order: {e}"

    def get_all_orders(self):
        with self.session() as cur:
            cur.execute(
                "SELECT order_id, email, table_number, items, total_amount, status, order_date, order_time FROM Orders"
            )
            return cur.fetchall()
