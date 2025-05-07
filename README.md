
Restaurant Management System

This is a full-stack web application for managing restaurant reservations, table availability, menu browsing, and food ordering. It includes a React frontend and a Flask backend with SQLite as the database.



## Features

### 🔐 Authentication
- Secure user registration with hashed passwords using `bcrypt`.
- User login with JWT-based session management.
- Role-based access control for customers and staff via protected routes.

### 📅 Reservations
- Real-time table availability check by date and time.
- Seamless reservation creation with conflict detection.
- Logged-in users can view their past and upcoming bookings.

### 🍽️ Menu and Orders
- Browse dynamic menu items with live availability status.
- Add items to orders and calculate totals automatically.
- Orders include time, date, and are linked to specific tables.

### 🧑‍🍳 Staff Dashboard
- Interactive dashboard for restaurant staff.
- View all reservations and orders in sortable tables.
- Create new food orders with selected menu items.
- Expandable dropdown panels for clean UI management.

### ✅ Testing
- A `test.py` script is included for automated testing of backend functionality.
- Tests cover:
  - User registration and login
  - Fetching menu items, customer emails, and table numbers
  - Retrieving reservations and orders from the database
- Built using Python’s built-in `unittest` framework.
- Includes `print()` statements for step-by-step feedback during test runs.
- Easily extendable to cover edge cases, data validation, or mock transactions.



## Tech Stack

**Client:** React, React Router, CSS

**Backend:** Flask, SQLite, bcrypt, JWT


## Installation

Install server dependencies with pip and start the Flask backend:

```bash
cd server
pip install flask flask-cors bcrypt pyjwt
python server.py
```
Install frontend dependencies with npm and start the React application:

```bash
cd client
npm install
npm start

```

## Authors

- [@kas-rabur](https://github.com/kas-rabur)
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/kas-rabur)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kacper-raburski-8a4415298/)


- [@Suleman-Mazhar](https://github.com/Suleman-Mazhar)
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/Suleman-Mazhar)
