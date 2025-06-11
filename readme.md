# MediTrack: Patient Medicine & Appointment Tracking System

MediTrack is a web-based application designed to help patients efficiently manage their healthcare journey. It provides a centralized platform to track appointments, prescriptions, medications, and medical history, with features like timely reminders and secure authentication.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributions](#contributions)

---

## Features

- **Appointment Booking**: Schedule appointments with preferred doctors.
- **Medication Tracking**: Manage and track prescriptions and medication schedules.
- **Medical History**: Access and view medical records anytime.
- **Reminders**: Receive reminders for upcoming appointments and medication times.
- **Secure Authentication**: Register and login with form validation and password strength checks.
- **Personalized Dashboard**: User-specific content and navigation based on login status.
- **Responsive UI**: Modern, mobile-friendly interface for all devices.

## Project Structure

```
Bytexl_FSD/
│
├── index.html
├── pages/
│   ├── appointments.html
│   ├── prescriptions.html
│   ├── login.html
│   └── register.html
├── js/
│   ├── main.js
│   ├── home.js
│   ├── auth.js
│   └── prescriptions.js
├── css/
│   ├── style.css
│   └── home.css
└── assets/
    └── images/
```

- **index.html**: Main landing page showcasing features and navigation.
- **pages/**: Individual pages for appointments, prescriptions, login, and registration.
- **js/**: JavaScript logic for general (main.js), home page (home.js), authentication (auth.js), and prescriptions (prescriptions.js).
- **css/**: Stylesheets for the main site and home page.
- **assets/**: Images and other assets.

---

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, etc.)
- No backend or database setup required (data stored in browser localStorage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Digantraj/Bytexl_FSD.git
   cd Bytexl_FSD
   ```
2. **Install Dependencies:**
   
   run this: (Node required)
   ```bash
   npm i
   ```  
5. **Open `index.html` in your browser.**

   You can use a local server for best results (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VSCode).

---

## Usage

- **Register**: Click "Register" to create a new account and fill out the registration form.
- **Login**: Use your credentials to log in and access the dashboard.
- **Book Appointments**: Navigate to "Appointments" to schedule and view upcoming doctor visits.
- **Track Prescriptions**: Go to "Prescriptions" to view and manage your medication schedules.
- **Medical History**: Review past appointments and prescriptions in the "Medical History" section.
- **Reminders**: Enable notifications to receive timely alerts for appointments and medications.
- **Logout**: Use the navigation bar to log out at any time.

---

## Technologies Used

- **HTML5 & CSS3**: For layout and styling.
- **JavaScript (ES6+)**: For application logic, validation, and dynamic UI.
- **LocalStorage**: For storing user data and session management.
- **Vite**: For local development and frontend tooling.
- **Responsive Design**: Ensures usability across devices.

---

## Contributions

Project for the course - Java Fullstack by ByteXL
Created by  [@aanubhavv](https://github.com/aanubhavv) and [@Digantraj](https://github.com/Digantraj)

---
