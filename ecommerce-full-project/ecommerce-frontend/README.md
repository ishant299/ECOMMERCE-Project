# E-Commerce Management System — Frontend

React + Tailwind CSS storefront and admin panel, built to consume the [ecommerce-backend](../ecommerce-backend) REST API.

## Features

- **Customer**: browse/search/filter/sort products, pagination, product detail with related items, cart (persisted in localStorage), checkout with shipping address + Cash on Delivery, order history, order detail, profile editing
- **Admin**: dashboard with live stats + revenue trend chart, product CRUD (add/update/delete/view products), category CRUD (blocked while in use), order management (status updates, cancel with restock), user management (promote/demote, enable/disable, delete)
- Role-based route guards (`ProtectedRoute`, `AdminRoute`)
- Fully responsive (desktop / tablet / mobile)
- JWT stored in localStorage, auto-attached to every request, auto-logout on expiry

## Tech Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- Axios

## Project Structure

```
ecommerce-frontend/
├── src/
│   ├── api/            # axios instance + one file per resource
│   ├── context/         # AuthContext, CartContext
│   ├── components/      # Navbar, ProductCard, Pagination, route guards, feedback UI
│   ├── pages/            # customer-facing pages
│   └── pages/admin/      # admin panel pages
├── index.html
├── tailwind.config.js
└── vite.config.js
```

## Installation

```bash
git clone <your-frontend-repo-url>
cd ecommerce-frontend
npm install
cp .env.example .env
# set VITE_API_URL to your backend's URL
npm run dev       # http://localhost:5173
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `https://your-api.onrender.com/api` |

## Build & Deploy

```bash
npm run build      # outputs to dist/
```

Recommended hosts: **Vercel** or **Netlify**.

## Deployment links

- Backend API URL: `https://<your-backend-service>.onrender.com/api`
- Frontend URL: `https://<your-frontend-app>.vercel.app`

Update these links once you have built and deployed both services.

1. Push this repo to GitHub.
2. Import it in Vercel/Netlify.
3. Build command: `npm run build` — Output directory: `dist`.
4. Add the `VITE_API_URL` environment variable pointing at your deployed backend.
5. Deploy — copy the live URL into your submission.

## Demo Accounts

Seed the backend first (`npm run seed` in the backend repo), then log in with:

- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`
