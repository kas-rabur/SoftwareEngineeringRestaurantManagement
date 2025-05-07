import unittest
from databaseLogic import Database


class TestDatabase(unittest.TestCase):
    def setUp(self):
        print("\nSetting up Database connection...")
        self.db = Database(db_path="./server/database.db")

    def test_register_and_login_user(self):
        print("Running test_register_and_login_user...")
        result = self.db.register_customer(
            "Test User", "1234567890", "testuser@example.com", "securepass"
        )
        print("Register result:", result)
        self.assertIn(result, ["User registered successfully", "User already exists"])

        user = self.db.login_user("testuser@example.com", "securepass")
        print("Login user object:", user)
        self.assertIsNotNone(user)
        self.assertEqual(user["email"], "testuser@example.com")

    def test_get_menu_items(self):
        print("Running test_get_menu_items...")
        items = self.db.get_menu_items()
        print(f"Menu items retrieved: {len(items)} items")
        self.assertIsInstance(items, list)

    def test_get_customer_emails(self):
        print("Running test_get_customer_emails...")
        emails = self.db.get_customer_emails()
        print(f"Customer emails retrieved: {emails}")
        self.assertIsInstance(emails, list)

    def test_get_table_numbers(self):
        print("Running test_get_table_numbers...")
        tables = self.db.get_table_numbers()
        print(f"Table numbers retrieved: {tables}")
        self.assertIsInstance(tables, list)

    def test_get_all_reservations(self):
        print("Running test_get_all_reservations...")
        reservations = self.db.get_all_reservations()
        print(f"Reservations retrieved: {len(reservations)}")
        self.assertIsInstance(reservations, list)

    def test_get_all_orders(self):
        print("Running test_get_all_orders...")
        orders = self.db.get_all_orders()
        print(f"Orders retrieved: {len(orders)}")
        self.assertIsInstance(orders, list)


if __name__ == "__main__":
    print("Starting database unit tests...\n")
    unittest.main()
