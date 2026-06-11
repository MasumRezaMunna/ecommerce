# Revenio — Full-Stack E-Commerce Platform

A production-ready e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 🚀 Live Demo

- **Frontend:** https://revenio.vercel.app *(deploy to Vercel)*
- **Backend API:** https://revenio-api.onrender.com *(deploy to Render)*

---

## 🔑 Demo Credentials

| Role  | Email                | Password    |
|-------|----------------------|-------------|
| Admin | admin@revenio.com    | Admin@1234  |
| User  | user@revenio.com     | Demo@1234   |

---

## ✨ Features

### Frontend
- ⚡ React 18 + Vite with code splitting & lazy loading
- 🎨 Tailwind CSS with full dark/light mode
- 🛒 Persistent cart with Zustand
- 🔒 JWT authentication with protected routes
- 📱 Fully responsive (mobile / tablet / desktop)
- 📊 Dashboard with Recharts (bar, line, pie charts)
- 🔍 Product search, filtering, sorting, pagination
- ⭐ Product reviews with star rating
- 💳 Multi-step checkout flow
- ❤️ Wishlist functionality

### Backend
- 🚀 Express.js REST API
- 🍃 MongoDB with Mongoose ODMs
- 🔐 JWT auth + bcrypt password hashing
- 👮 Role-based access control (user / admin)
- 📦 Full CRUD for products, categories, orders
- 📊 Aggregation-based analytics endpoint
- 🛡️ Helmet, CORS, rate limiting, input validation
- 📁 File upload with Multer
- 🌱 Database seeder with realistic data

---

## 📁 Project Structure

```
revenio/
├── server/                    # Express + MongoDB API
│   ├── config/               # DB connection, seed data
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, error handler, upload
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   └── index.js              # Entry point
│
└── client/                    # React + Vite frontend
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # Zustand stores (auth, cart, theme)
    │   ├── pages/            # Route pages
    │   │   ├── admin/        # Admin dashboard pages
    │   │   ├── auth/         # Login / Register
    │   │   └── dashboard/    # User dashboard pages
    │   ├── styles/           # Global CSS + Tailwind config
    │   └── utils/            # API client, helpers
    └── public/
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET

npm install
npm run seed    # Seeds demo products, users, orders
npm run dev     # Starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
# Set VITE_API_URL=https://your-api-url.onrender.com/api
```

### Backend → Render / Railway
```bash
# Set environment variables in dashboard:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| PUT | /api/auth/update-profile | Auth |
| PUT | /api/auth/change-password | Auth |
| POST | /api/auth/wishlist/:productId | Auth |

### Products
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/products | Public |
| GET | /api/products/featured | Public |
| GET | /api/products/:slug | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |

### Orders
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/orders | Auth |
| GET | /api/orders/my-orders | Auth |
| GET | /api/orders/:id | Auth |
| PATCH | /api/orders/:id/cancel | Auth |
| GET | /api/orders | Admin |
| PATCH | /api/orders/:id/status | Admin |

### Stats
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/stats/admin | Admin |
| GET | /api/stats/user | Auth |

---

## 🧰 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Zustand, TanStack Query, React Router 6, Recharts, React Hook Form, React Hot Toast, Lucide Icons, Framer Motion

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, Express Validator, Helmet, Morgan

---

## 📝 License

MIT © 2024 Revenio. Built for the Revenio Project.
