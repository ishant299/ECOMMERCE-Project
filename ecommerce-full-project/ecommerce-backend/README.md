# E-Commerce Management System — Backend

REST API for a full-featured e-commerce platform, built with **Node.js, Express, and MongoDB**.

## Features

- JWT authentication (register, login, logout, profile)
- Role-based access control (`customer`, `admin`)
- Product catalog: CRUD, search, category/price/availability filters, sorting, pagination
- Category management (CRUD, blocks deletion while products reference it)
- Order placement with atomic stock deduction (Mongo transactions), order history, admin order management (status update, cancel with restock)
- Admin dashboard aggregate stats (totals, pending/delivered counts, revenue, monthly revenue trend)
- Centralized error handling, input validation, rate limiting on auth routes, Helmet security headers

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- express-validator, express-async-handler, helmet, cors, morgan, express-rate-limit

## Project Structure

```
ecommerce-backend/
├── config/db.js              # MongoDB connection
├── models/                   # Mongoose schemas: User, Product, Category, Order
├── controllers/               # Route handler logic
├── middleware/                # auth, error handling, validation
├── routes/                    # Express routers
├── utils/                     # JWT helper, query builder, seed script
├── server.js                  # App entry point
└── .env.example
```

## Installation

```bash
git clone <your-backend-repo-url>
cd ecommerce-backend
npm install
cp .env.example .env
# fill in MONGO_URI and JWT_SECRET in .env
npm run seed     # optional: creates admin/customer demo accounts + sample data
npm run dev       # starts on http://localhost:5000
```

## MongoDB Atlas Setup

1. Create a cluster in MongoDB Atlas.
2. In Atlas, add your current IP address under Network Access.
3. Create a database user under Database Access.
4. Copy the Atlas Node.js connection string and paste it into `.env` as `MONGO_URI`.
5. Replace `<username>`, `<password>`, and the database name in the URI.
6. Leave `ALLOW_LOCAL_DB_FALLBACK=false` unless you intentionally want the app to try a local MongoDB server.

## Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `ALLOW_LOCAL_DB_FALLBACK` | Set to `true` only if you want to fall back to a local MongoDB server |
| `LOCAL_MONGO_URI` | Optional local MongoDB URI used when local fallback is enabled |
| `JWT_SECRET` | Long random secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Deployed frontend URL (for CORS) |

## API Overview

### Auth
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Private |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/me` | Private |

### Products
| Method | Route | Access |
|---|---|---|
| GET | `/api/products?search=&category=&minPrice=&maxPrice=&availability=&sort=&page=&limit=` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Categories
| Method | Route | Access |
|---|---|---|
| GET | `/api/categories` | Public |
| GET | `/api/categories/:id` | Public |
| POST | `/api/categories` | Admin |
| PUT | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Orders
| Method | Route | Access |
|---|---|---|
| POST | `/api/orders` | Customer |
| GET | `/api/orders/my-orders` | Customer |
| GET | `/api/orders/:id` | Owner or Admin |
| GET | `/api/orders?status=&page=&limit=` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| PUT | `/api/orders/:id/cancel` | Admin |

### Dashboard
| Method | Route | Access |
|---|---|---|
| GET | `/api/dashboard` | Admin |

### Users (bonus)
| Method | Route | Access |
|---|---|---|
| GET | `/api/users` | Admin |
| GET/PUT/DELETE | `/api/users/:id` | Admin |

## Deployment

Recommended: **Render** or **Railway** for the API, **MongoDB Atlas** for the database.

## Deployment links

- Backend API URL: `https://<your-backend-service>.onrender.com/api`

Update this after you deploy the backend.

1. Push this repo to GitHub.
2. Create a new Web Service on Render/Railway pointing at the repo.
3. Set the environment variables above in the platform's dashboard.
4. Build command: `npm install` — Start command: `npm start`.
5. Once live, copy the service URL into the frontend's `VITE_API_URL`.

## Demo Accounts (after `npm run seed`)

- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`
