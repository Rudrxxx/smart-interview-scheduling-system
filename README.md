# Smart Interview Scheduling System

## Project Overview

The **Smart Interview Scheduling System** is a full-stack web application designed to streamline and automate the recruitment workflow for organizations and institutions.

It provides a structured platform where:

* **Admins** create and manage recruitment drives
* **Students/Candidates** apply for opportunities
* **Interviewers** evaluate candidates
* The system handles **scheduling, tracking, and result publishing**

The system follows **clean architecture principles**, emphasizing backend design, scalability, and maintainability.

---

# Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS (Minimal, Linear-inspired UI)
* Clerk (Authentication)

## Backend

* FastAPI (Python)
* PostgreSQL (via Supabase)
* SQLAlchemy (ORM)
* Pydantic (Validation)

## Authentication

* Clerk (JWT RS256 via JWKS)
* Backend verifies Clerk tokens
* Role-based authorization handled internally

---

# Architecture

The backend follows **clean layered architecture**:

```
Controllers → Services → Repositories → Database
```

## Layers:

### 1. Controllers

* Handle HTTP requests/responses
* Route definitions

### 2. Services

* Business logic
* Application workflows

### 3. Repositories

* Database interaction
* Query abstraction

### 4. Models

* Database schema (SQLAlchemy)
* Entity definitions

---

# Core Entities

* User (Admin / Student / Interviewer)
* RecruitmentDrive
* Application
* Interview
* Evaluation

---

# Authentication & Authorization

## Authentication

* Managed by Clerk (frontend)
* Backend verifies Clerk JWT using JWKS

## Authorization

* Role-based access:

  * Admin
  * Student
  * Interviewer

---

# MUST-HAVE FEATURES (Core Functionality)

## User Management

* Clerk-based authentication
* Automatic user creation in DB
* Role assignment (default: student)

---

## Recruitment Drive Management (Admin)

* Create recruitment drives
* Define eligibility criteria
* Manage drive status (active/closed)

---

## Application System (Student)

* Apply to recruitment drives
* Track application status
* View applied drives

---

## Interview Scheduling

* Automatic/manual scheduling
* Assign interviewer
* Manage time slots

---

## Interview Management (Interviewer)

* View assigned interviews
* Submit evaluation
* Provide score and feedback

---

## Evaluation & Results

* Store evaluation data
* Calculate final results
* Admin publishes results

---

# ADVANCED / BONUS FEATURES (High-Impact)

## Smart Scheduling (Optional)

* Auto-assign interviewer based on availability
* Avoid scheduling conflicts

---

## Dashboard Analytics

* Total applicants
* Selection rate
* Drive performance

---

## Notifications (Optional)

* Email/real-time updates
* Status changes

---

## Filtering & Search

* Filter drives
* Search candidates
* Sort applications

---

## Audit & Logs (Advanced)

* Track actions (admin/interviewer)
* Maintain system history

---

# UI/UX Design Principles

* Minimalist (Linear/Notion inspired)
* No gradients or flashy elements
* Focus on usability and clarity
* Clean tables and structured data views

---

# Key Design Principles Implemented

## OOP Principles

* Encapsulation → Models & Services
* Abstraction → Repository Layer
* Inheritance → User roles (BaseUser → Admin/Student/Interviewer)
* Polymorphism → Role-based behavior

---

## Design Patterns

* Repository Pattern
* Service Layer Pattern
* Dependency Injection (FastAPI)
* Clean Architecture Separation

---

# System Flow (End-to-End)

1. User signs in via Clerk
2. Backend verifies token
3. User is created/retrieved from DB
4. Admin creates recruitment drive
5. Student applies
6. System schedules interview
7. Interviewer evaluates
8. System calculates result
9. Admin publishes result

---

# Testing & Validation

* API testing via FastAPI `/docs`
* End-to-end flow validation
* Database consistency checks

---

# Conclusion

This project demonstrates:

* Strong backend engineering skills
* Real-world system design
* Clean architecture implementation
* Modern authentication (Clerk)
* Scalable and maintainable codebase
