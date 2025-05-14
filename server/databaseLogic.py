# import modules for database, hashing, and context management
import sqlite3
import bcrypt
from contextlib import contextmanager

# define default database path
DB_PATH = "database.db"


# class encapsulating all database operations
class Database:
    def __init__(self, db_path=DB_PATH):
        # lower-level attributes
        self.db_path = db_path
        self.conn = None

    # connect to sqlite database and set row factory
    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_path, timeout=10)
            self.conn.row_factory = sqlite3.Row
            return self.conn
        except sqlite3.Error as e:
            raise RuntimeError(f"failed to connect to database: {e}")

    # close active database connection
    def close(self):
        if self.conn:
            try:
                self.conn.close()
            except sqlite3.Error:
                pass
            finally:
                self.conn = None

    @contextmanager
    # manage a session with commit/rollback semantics
    def session(self):
        conn = self.connect()
        cursor = conn.cursor()
        try:
            yield cursor
            conn.commit()
        except sqlite3.IntegrityError as ie:
            conn.rollback()
            raise
        except Exception:
            conn.rollback()
            raise
        finally:
            self.close()

    # insert a new reservation record
    def create_reservation(self, customer_email, date, time, table_number, status):
        # validate inputs
        if not all([customer_email, date, time, table_number, status]):
            return "missing reservation fields"
        try:
            with self.session() as cur:
                cur.execute(
                    "INSERT INTO Reservations "
                    "(customer_email, reservation_date, reservation_time, table_id, status) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (customer_email, date, time, table_number, status),
                )
            return "reservation created"
        except sqlite3.IntegrityError:
            return "reservation conflict or invalid reference"
        except Exception as e:
            return f"error creating reservation: {e}"

    # register a new customer with hashed password
    def register_customer(self, name, contact, email, password):
        # validate inputs
        if not all([name, contact, email, password]):
            return "missing registration fields"
        try:
            pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
                "utf-8"
            )
            with self.session() as cur:
                cur.execute(
                    "INSERT INTO Person (name, contact, email, password, role) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (name, contact, email, pw_hash, "user"),
                )
            return "user registered successfully"
        except sqlite3.IntegrityError:
            return "user already exists"
        except Exception as e:
            return f"error registering user: {e}"

    # verify login credentials and return user info
    def login_user(self, email, password):
        # validate inputs
        if not email or not password:
            return None
        try:
            with self.session() as cur:
                cur.execute(
                    "SELECT id, name, email, role, password FROM Person WHERE email = ?",
                    (email,),
                )
                row = cur.fetchone()
        except Exception:
            return None

        if row:
            try:
                if bcrypt.checkpw(
                    password.encode("utf-8"), row["password"].encode("utf-8")
                ):
                    return {
                        "id": row["id"],
                        "name": row["name"],
                        "email": row["email"],
                        "role": row["role"],
                    }
            except ValueError:
                return None
        return None

    # get all tables with availability status for a given date/time
    def get_all_tables_with_status(self, date, time):
        # validate inputs
        if not date or not time:
            return []
        try:
            with self.session() as cur:
                cur.execute(
                    "SELECT table_id FROM Reservations "
                    "WHERE reservation_date = ? AND reservation_time = ? AND status = 'confirmed'",
                    (date, time),
                )
                reserved = {r[0] for r in cur.fetchall()}
                cur.execute("SELECT table_id, capacity FROM TableInfo")
                tables = cur.fetchall()
        except Exception:
            return []

        return [
            {
                "table_id": t["table_id"],
                "capacity": t["capacity"],
                "available": t["table_id"] not in reserved,
            }
            for t in tables
        ]

    # fetch reservations for a specific customer
    def get_reservations(self, email):
        # validate input
        if not email:
            return []
        try:
            with self.session() as cur:
                cur.execute(
                    "SELECT reservation_date, reservation_time, table_id "
                    "FROM Reservations WHERE customer_email = ?",
                    (email,),
                )
                return cur.fetchall()
        except Exception:
            return []

    # fetch all reservations in the system
    def get_all_reservations(self):
        try:
            with self.session() as cur:
                cur.execute("SELECT * FROM Reservations")
                return cur.fetchall()
        except Exception:
            return []

    # retrieve all menu items
    def get_menu_items(self):
        try:
            with self.session() as cur:
                cur.execute("SELECT * FROM Menu")
                return [dict(row) for row in cur.fetchall()]
        except Exception:
            return []

    # retrieve all customer emails
    def get_customer_emails(self):
        try:
            with self.session() as cur:
                cur.execute("SELECT email FROM Person WHERE role = 'user'")
                return [row[0] for row in cur.fetchall()]
        except Exception:
            return []

    # retrieve all table numbers
    def get_table_numbers(self):
        try:
            with self.session() as cur:
                cur.execute("SELECT table_id FROM TableInfo")
                return [row[0] for row in cur.fetchall()]
        except Exception:
            return []

    # place a new order with rounded total amount
    def make_order(self, email, table_id, items, amount, order_date, order_time):
        # validate inputs
        if not all([email, table_id, items, amount, order_date, order_time]):
            return "missing order fields"
        try:
            rounded = round(float(amount), 2)
        except (ValueError, TypeError):
            return "invalid amount value"

        try:
            with self.session() as cur:
                cur.execute(
                    "INSERT INTO Orders "
                    "(email, table_number, items, total_amount, status, order_date, order_time) "
                    "VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (
                        email,
                        table_id,
                        items,
                        rounded,
                        "pending",
                        order_date,
                        order_time,
                    ),
                )
            return "order placed successfully"
        except sqlite3.IntegrityError:
            return "error placing order: invalid reference"
        except Exception as e:
            return f"error placing order: {e}"

    # fetch all orders in the system
    def get_all_orders(self):
        try:
            with self.session() as cur:
                cur.execute(
                    "SELECT order_id, email, table_number, items, total_amount, status, order_date, order_time "
                    "FROM Orders"
                )
                return cur.fetchall()
        except Exception:
            return []
