import unittest
from databaseLogic import Database


# define test case for database operations
class TestDatabase(unittest.TestCase):

    # setup a fresh database connection before each test
    def setUp(self):
        print("\nSetting up Database connection...")
        self.db = Database(db_path="./server/database.db")

    # test registering a new user and logging them in
    def test_register_and_login_user(self):
        print("Running test_register_and_login_user...")
        # attempt to register user and check expected outcome
        result = self.db.register_customer(
            "Test User", "1234567890", "testuser@example.com", "securepass"
        )
        print("Register result:", result)
        self.assertIn(result, ["User registered successfully", "User already exists"])

        # attempt to log in with the same credentials
        user = self.db.login_user("testuser@example.com", "securepass")
        print("Login user object:", user)
        self.assertIsNotNone(user)
        self.assertEqual(user["email"], "testuser@example.com")

    # test fetching all menu items
    def test_get_menu_items(self):
        print("Running test_get_menu_items...")
        items = self.db.get_menu_items()
        print(f"Menu items retrieved: {len(items)} items")
        self.assertIsInstance(items, list)

    # test fetching all customer emails
    def test_get_customer_emails(self):
        print("Running test_get_customer_emails...")
        emails = self.db.get_customer_emails()
        print(f"Customer emails retrieved: {emails}")
        self.assertIsInstance(emails, list)

    # test fetching all table numbers
    def test_get_table_numbers(self):
        print("Running test_get_table_numbers...")
        tables = self.db.get_table_numbers()
        print(f"Table numbers retrieved: {tables}")
        self.assertIsInstance(tables, list)

    # test retrieving all reservations
    def test_get_all_reservations(self):
        print("Running test_get_all_reservations...")
        reservations = self.db.get_all_reservations()
        print(f"Reservations retrieved: {len(reservations)}")
        self.assertIsInstance(reservations, list)

    # test retrieving all orders
    def test_get_all_orders(self):
        print("Running test_get_all_orders...")
        orders = self.db.get_all_orders()
        print(f"Orders retrieved: {len(orders)}")
        self.assertIsInstance(orders, list)


# run tests when this file is executed directly
if __name__ == "__main__":
    print("Starting database unit tests...\n")
    unittest.main()
