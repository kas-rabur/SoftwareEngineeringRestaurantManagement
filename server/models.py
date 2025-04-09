class Person:
    def __init__(self, name, contact, address, email):
        self.name = name
        self.contact = contact
        self.address = address
        self.email = email

    def ChangeInfo(self, name, contact, address, email):
        self.name = name
        self.contact = contact
        self.address = address
        self.email = email

class Customer(Person):
    def __init__(self, name, contact, address, email):
        super().__init__(name, contact, address, email)

    def MakeReservation(self):
        pass

    def ViewReservation(self):
        pass

    def Order(self):
        pass

class Employee(Person):
    def __init__(self, name, contact, address, email, schedule, hours_worked, current_task):
        super().__init__(name, contact, address, email)
        self.schedule = schedule
        self.hours_worked = hours_worked
        self.current_task = current_task  

    def ViewTimetable(self):
        pass

    def ClockIn(self):
        pass

    def ClockOut(self):
        pass

    def UpdateTask(self):
        pass

class Waiter(Employee):
    def __init__(self, name, contact, address, email, schedule, hours_worked, current_task):
        super().__init__(name, contact, address, email, schedule, hours_worked, current_task)

    def TakeOrder(self):
        pass

    def UpdateStatus(self):
        pass

class KitchenStaff(Employee):
    def __init__(self, name, contact, address, email, schedule, hours_worked, current_task):
        super().__init__(name, contact, address, email, schedule, hours_worked, current_task)

    def ViewOrder(self):
        pass

    def UpdateStatus(self):
        pass

class Reservations:
    def __init__(self, reservation_id, customer_id, date, time, table_number, status):
        self.reservation_id = reservation_id
        self.customer_id = customer_id
        self.date = date
        self.time = time
        self.table_number = table_number
        self.status = status  

    def CreateReservation(self):
        pass

    def ChangeReservation(self):
        pass

    def CancelReservation(self):
        pass

class Order:
    def __init__(self, order_id, customer_id, table_number, items, total_amount, status):
        self.order_id = order_id
        self.customer_id = customer_id
        self.table_number = table_number
        self.items = items
        self.total_amount = total_amount
        self.status = status  

    def CreateOrder(self):
        pass

    def UpdateOrder(self):
        pass

    def CancelOrder(self):
        pass

class Inventory:
    def __init__(self, item_id, item_name, quantity, unit, price, restock_threshold, category):
        self.item_id = item_id
        self.item_name = item_name
        self.quantity = quantity
        self.unit = unit
        self.price = price
        self.restock_threshold = restock_threshold
        self.category = category

    def AddItem(self):
        pass

    def UpdateStock(self):
        pass

    def CheckStock(self):
        pass

    def AlertLowStock(self):
        pass

    def RemoveItem(self):
        pass

class Menu:
    def __init__(self, menu_id, item_name, description, price, category, availability_status):
        self.menu_id = menu_id
        self.item_name = item_name
        self.description = description
        self.price = price
        self.category = category
        self.availability_status = availability_status

    def AddItem(self):
        pass

    def UpdateItem(self):
        pass

    def RemoveItem(self):
        pass

    def GetAvailable(self):
        pass

    def SearchMenu(self):
        pass

class Payment:
    def __init__(self, payment_id, customer_id, order_id, amount, payment_method, status):
        self.payment_id = payment_id
        self.customer_id = customer_id
        self.order_id = order_id 
        self.amount = amount
        self.payment_method = payment_method
        self.status = status

    def ProcessPayment(self):
        pass

    def RefundPayment(self):
        pass

    def GenerateReceipt(self):
        pass

    def UpdatePaymentRecord(self):
        pass

class Table:
    def __init__(self, table_id, capacity, status):
        self.table_id = table_id
        self.capacity = capacity
        self.status = status

    def UpdateStatus(self):
        pass

    def GetTableInfo(self):
        pass

    def ReserveTable(self):
        pass

    def ReleaseTable(self):
        pass
