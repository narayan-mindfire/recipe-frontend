# Recipe Sharing Platform

A full-stack MERN (MongoDB, Express, React, Node.js) recipe sharing application that allows users to create, search, rate, and comment on recipes. Built with a focus on clean UI, accessibility, and route protection.

---

## Features

### Recipe Management

- Create Recipes: Add recipes with title, ingredients, preparation steps, and an image.
- View Recipes: Browse a list of recipes with filters and sorting.
- Recipe Details: View full recipe details including user ratings and comments.

### Search & Filter

- Search by Ingredients: Type comma-separated ingredients to find matching recipes.
- Filter Options: Filter recipes by rating and preparation time.
- Sort By: Recently updated, top rated, or quickest first.

### Ratings & Comments

- Rate Recipes: Logged-in users can rate recipes (1–5 stars).
- Commenting: Add comments and feedback on any recipe (if authenticated).

### Authentication

- User Signup/Login: Form-based registration and login.
- Route Protection: Authenticated routes (Dashboard, Create, Profile).
- Guest Protection: Prevent logged-in users from accessing Login/Register.

### Error Handling

- Display toast messages for invalid actions, unauthorized access, or API failures.

---

## Tech Stack

| Frontend         |
| ---------------- |
| React 19 + Vite  |
| Tailwind CSS     |
| React Hook Form  |
| Zod (validation) |
| Context API      |
| Vitest + RTL     |

---

## Project Structure

```
frontend/
│
├── src/
│   ├── assets/                  # Static images and media
│   ├── components/
│   │   ├── dashboard/           # Filters, listings, etc.
│   │   └── utils/               # Navbar, Footer, Buttons, Modals
│   ├── context/                 # Auth context
│   ├── hooks/                   # Custom hooks (e.g., useAuth, useTheme)
│   ├── pages/                   # Route components (Login, Register, etc.)
│   ├── routes/                  # Protected & Guest route wrappers
│   ├── service/                 # Axios interceptors
│   ├── zod/                     # Zod validation schemas
│   └── main.tsx                 # Entry point
│
├── public/                      # Static files
├── index.html                   # Root HTML
└── package.json                 # Scripts & dependencies
```

---

## Testing

- Tests are written using Vitest and React Testing Library.
- Includes route protection tests, login flow, UI components, etc.

```bash
# Run unit tests
npm run test
```

---

## Installation & Running Locally

### Clone the Repository

```bash
git clone https://github.com/narayan-mindfire/recipe-frontend.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

> App will run at: http://localhost:5173

---

## Route Protection Summary

| Route                          | Access                  | Redirects to            |
| ------------------------------ | ----------------------- | ----------------------- |
| /login, /register              | Not for logged-in users | /dashboard              |
| /dashboard, /createRecipe, /me | Logged-in only          | /unauthenticated        |
| Unknown pages                  | Anyone                  | Renders 404 - Not Found |
| /unauthenticated               | Public                  | Message: "Unauthorized" |

---

## Backend Repository

https://github.com/narayan-mindfire/recipe-backend

---

## Scripts

| Script         | Description                     |
| -------------- | ------------------------------- |
| npm run dev    | Start development server (Vite) |
| npm run build  | Build app for production        |
| npm run test   | Run tests via Vitest            |
| npm run lint   | Lint the codebase               |
| npm run format | Format files with Prettier      |

---
