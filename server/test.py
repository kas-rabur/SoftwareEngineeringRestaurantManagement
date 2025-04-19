import sqlite3

def create_tables():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO Menu (item_name, description, price, category, availability_status) VALUES
            ('Margherita Pizza', 'Classic cheese and tomato pizza with fresh basil.', 8.99, 'Main', 1),
            ('Pepperoni Pizza', 'Spicy pepperoni with mozzarella and tomato sauce.', 9.99, 'Main', 1),
            ('Garlic Bread', 'Toasted bread with garlic butter.', 3.99, 'Starter', 1),
            ('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons.', 5.99, 'Starter', 1),
            ('Chocolate Lava Cake', 'Warm chocolate cake with a gooey center.', 4.99, 'Dessert', 1),
            ('Tiramisu', 'Layered Italian dessert with coffee-soaked biscuits.', 5.49, 'Dessert', 1),
            ('Lemonade', 'Refreshing homemade lemonade.', 2.49, 'Drinks', 1),
            ('Espresso', 'Strong Italian-style coffee shot.', 1.99, 'Drinks', 1),
            ('Fish & Chips', 'Golden fried cod with chunky fries.', 10.49, 'Main', 0),
            ('Chicken Wings', 'Spicy grilled chicken wings.', 6.99, 'Starter', 1)
    ''')

    conn.commit()
    conn.close()
    print("Tables populated successfully!")

def main():
    create_tables()

if __name__ == "__main__":
    main()
