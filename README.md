# AI Chatbot Drink Ordering System

**AI-powered drink ordering platform with chatbot and voice support. Includes an admin dashboard for product management and real-time stock updates.**

Built using React, Node.js, Express, and MySQL with cloud deployment.

Tech Stack: React • Node.js • Express.js • MySQL • Aiven • Netlify • Render

---

## Overview

This project is a full-stack drink ordering system where customers can place orders through a chat-style interface using either text or voice input.

The system includes an admin panel to manage drinks and stock. Inventory automatically updates whenever a customer places an order, ensuring accurate stock tracking.

---

## Features

### Admin Panel

#### Add Products

* Add new drinks dynamically
* Set drink prices
* View existing products
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

Customers can order drinks through an interactive chatbot interface.

Features:

* Chat-style UI
* Text input ordering
* Voice input ordering
* Display available drinks with prices
* Select drinks via text or voice
* Check stock availability before confirming order
* Low stock warning message
* Automatic stock deduction after successful order
* Final confirmation message
* Voice output for order confirmation

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

## Installation

### Clone Repository

git clone https://github.com/your-username/project-name.git

### Install Dependencies

Frontend

cd frontend
npm install

Backend

cd backend
npm install

---

## Run the Project

Backend

npm start

Frontend

npm run dev

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
