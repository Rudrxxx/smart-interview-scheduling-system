# Smart Interview Scheduling System

A full-stack campus recruitment platform that streamlines the entire hiring workflow — from drive creation to interview scheduling and evaluation.

Built with **FastAPI** (Python) on the backend and **React** (Vite) on the frontend.

---

## Features

### For Admins
- Create & manage **recruitment drives** with eligibility criteria and deadlines
- View and manage all **student applications** — shortlist or reject with one click
- **Schedule interviews** by assigning interviewers, date/time, round number, and Google Meet links
- View all interviews with enriched data (candidate name, drive title, interviewer)
- Manage **user roles** — promote students to interviewers or admins
- Publish **evaluation results**

### For Students
- Browse **active recruitment drives** and apply instantly
- Track application status in **My Applications**
- View interview schedule and join Google Meet links

### For Interviewers
- View **assigned interviews** with candidate details
- Join Google Meet directly from the dashboard
- Submit **evaluations** with scores and feedback

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS |
| **Backend** | FastAPI, Python 3.11, Uvicorn |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | SQLAlchemy |
| **Validation** | Pydantic v2 |
| **Auth** | JWT (HS256) with bcrypt password hashing |
| **HTTP Client** | Axios |

---

## Architecture

The backend follows **clean layered architecture**:

```
Controllers → Services → Repositories → Database
```

- **Controllers** — Handle HTTP request/response, route definitions
- **Services** — Business logic and application workflows
- **Repositories** — Database interaction and query abstraction
- **Models** — SQLAlchemy entity definitions
- **Schemas** — Pydantic request/response validation

### Design Patterns Used
- Repository Pattern
- Service Layer Pattern
- Dependency Injection (FastAPI)
- Clean Architecture Separation

---

## Core Entities

| Entity | Description |
|---|---|
| **User** | Admin, Student, or Interviewer (role-based) |
| **RecruitmentDrive** | Job posting with eligibility, deadline, and status |
| **Application** | Student's application to a drive |
| **Interview** | Scheduled interview with date, round, and meet link |
| **Evaluation** | Interviewer's score and feedback for an interview |

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ (or use `nvm`)
- PostgreSQL database (Supabase recommended)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
DATABASE_URL=postgresql://your_connection_string
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

Seed demo data:
```bash
python seed.py
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

Run the dev server:
```bash
npm run dev
```

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | demo123 |
| Student | student@demo.com | demo123 |
| Interviewer | interviewer@demo.com | demo123 |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/users/me` | Get current user profile |

### Recruitment Drives
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/drives/` | All users (students see active only) |
| POST | `/api/drives/` | Admin |
| PUT | `/api/drives/:id` | Admin |
| DELETE | `/api/drives/:id` | Admin |

### Applications
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/applications/` | Student |
| GET | `/api/applications/my` | Student |
| GET | `/api/applications/` | Admin |
| PATCH | `/api/applications/:id/status` | Admin |

### Interviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/interviews/` | Admin |
| GET | `/api/interviews/` | Admin |
| GET | `/api/interviews/my` | Interviewer |

### Evaluations
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/evaluations/` | Interviewer |
| GET | `/api/evaluations/interview/:id` | Admin |

---

## System Flow

1. User signs up / logs in → receives JWT token
2. Admin creates a recruitment drive
3. Student browses active drives and applies
4. Admin reviews applications — shortlists or rejects
5. Admin schedules interview (assigns interviewer, date, meet link)
6. Interviewer joins meet, evaluates candidate
7. Admin reviews evaluations and publishes results

---

## OOP Principles

- **Encapsulation** → Models & Services contain internal logic
- **Abstraction** → Repository layer abstracts all database operations
- **Inheritance** → User roles extend base User entity
- **Polymorphism** → Role-based behavior across controllers

---

## License

This project is for educational purposes — built as a campus recruitment management system demonstrating clean architecture, OOP design patterns, and full-stack development skills.
