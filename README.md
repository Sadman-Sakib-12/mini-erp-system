# Mini ERP System

A modern **Mini ERP (Enterprise Resource Planning) System** built with **React, TypeScript, Vite, Tailwind CSS, Shadcn UI, and Supabase**. The application provides inventory management, purchase & sales tracking, customer and supplier management, invoice generation, and role-based authentication.

---

## Live Demo

**Live URL:** https://mini-erp-system-omega.vercel.app/

## GitHub Repository

https://github.com/Sadman-Sakib-12/mini-erp-system

---

## Features

* User Authentication (Supabase Auth)
* Role-Based Access Control (Admin & Staff)
* Dashboard with business overview
* Product Management (CRUD)
* Customer Management
* Supplier Management
* Purchase Management
* Sales Management
* Automatic Inventory Updates
* PDF Invoice Generation
* Responsive UI
* Protected Routes
* Clean Service-Based Architecture

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Shadcn UI
* React Router DOM

### Backend & Database

* Supabase
* PostgreSQL
* Row Level Security (RLS)
* Database Triggers

### Other Libraries

* jsPDF
* React Hook Form
* Zod
* Lucide React

---

## Project Structure

```text
src/
│
├── components/
├── pages/
├── routes/
├── services/
├── hooks/
├── lib/
├── types/
├── layouts/
└── utils/
```

---

## Architecture

The project follows a modular and scalable architecture.

* Component-based UI
* Service layer for database operations
* Protected routing
* Type-safe development using TypeScript
* PostgreSQL Triggers for automatic stock management
* Row Level Security (RLS) for secure data access

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/Sadman-Sakib-12/mini-erp-system.git
```

Navigate into the project

```bash
cd mini-erp-system
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

## AI-Assisted Development

This project was developed using an AI-assisted workflow with:

* ChatGPT
* Gemini
* Cursor
* Windsurf
* Google Antigravity IDE

The AI tools were used to accelerate development, while project architecture, integration, debugging, testing, and final validation were completed through iterative development.

---

## Author

**Sadman Sakib**

MERN Stack Developer

GitHub: https://github.com/Sadman-Sakib-12
