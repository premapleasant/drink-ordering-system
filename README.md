# Drink Ordering System

**Live Demo:** https://drink-ordering-system.netlify.app

An AI-powered drink ordering platform that allows customers to order beverages using a chat-style interface with text or voice input. The system includes an admin dashboard for managing products and stock while automatically updating inventory after each order.

This project demonstrates a full-stack application with real-time inventory management and a conversational ordering experience.

---

## Features

### Admin Panel

#### Add Products

* Add new drinks dynamically
* Set drink prices
* View available products
* Edit or delete products

Fields:

* Drink Name
* Price

---

#### Manage Stock

* Set or update stock quantities
* View current stock levels
* Low stock warning when quantity is less than 5
* Stock automatically updates after each order

---

### Customer Chatbot Ordering

Customers can place drink orders using a chatbot-style interface.

Features:

* Chat-style user interface
* Text input ordering
* Voice input ordering
* Display available drinks with prices
* Select drinks via text or voice
* Check stock availability before confirming order
* Show low-stock warning message
* Automatically deduct stock after successful order
* Final confirmation message
* Voice output for confirmation

---

## Tech Stack

Frontend

* React
* CSS

Backend

* Node.js
* Express.js

Database

* MySQL (Hosted on Aiven)

Deployment

* Netlify (Frontend)
* Render (Backend)

---

## System Architecture

Customer → Chatbot Interface → Backend API → Database
Admin Panel → Backend API → Database

---

## Project Structure

frontend/

* components/
* pages/
* chatbot/

backend/

* routes/
* controllers/
* models/

database/

* schema.sql

---

## Future Improvements

* AI intent recognition for natural language ordering
* Order history tracking
* Payment integration
* Product images
* Advanced analytics dashboard

---

## Author

Prema
Software Developer
