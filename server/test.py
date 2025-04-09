import sqlite3

def create_tables():
    # Connect to the database file (creates it if it doesn't exist)
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # SQL commands to create the tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Person (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        contact TEXT,
        address TEXT,
        email TEXT
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Customer (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        person_id INTEGER,
        FOREIGN KEY (person_id) REFERENCES Person (id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Employee (
        employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
        person_id INTEGER,
        schedule TEXT,
        hours_worked INTEGER,
        current_task TEXT,
        FOREIGN KEY (person_id) REFERENCES Person (id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Waiter (
        waiter_id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        FOREIGN KEY (employee_id) REFERENCES Employee (employee_id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS KitchenStaff (
        kitchen_staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        FOREIGN KEY (employee_id) REFERENCES Employee (employee_id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Reservations (
        reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        reservation_date TEXT,
        reservation_time TEXT,
        table_number INTEGER,
        status TEXT,
        FOREIGN KEY (customer_id) REFERENCES Customer (customer_id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        table_number INTEGER,
        items TEXT,
        total_amount REAL,
        status TEXT,
        FOREIGN KEY (customer_id) REFERENCES Customer (customer_id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Inventory (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        quantity INTEGER,
        unit TEXT,
        price REAL,
        restock_threshold INTEGER,
        category TEXT
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Menu (
        menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        description TEXT,
        price REAL,
        category TEXT,
        availability_status INTEGER
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Payment (
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        order_id INTEGER,
        amount REAL,
        payment_method TEXT,
        status TEXT,
        FOREIGN KEY (customer_id) REFERENCES Customer (customer_id),
        FOREIGN KEY (order_id) REFERENCES Orders (order_id)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS TableInfo (
        table_id INTEGER PRIMARY KEY AUTOINCREMENT,
        capacity INTEGER,
        status TEXT
    )''')

    # Commit changes and close connection
    conn.commit()
    conn.close()
    print("Tables created successfully!")

def main():
    create_tables()

if __name__ == "__main__":
    main()
