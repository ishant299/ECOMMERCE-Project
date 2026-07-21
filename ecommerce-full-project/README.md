# E-Commerce Management System — Coding Age Project 2

Full-stack e-commerce application: **Node.js + Express + MongoDB** backend, **React + Tailwind CSS** frontend.

This bundle contains two independent, separately-deployable projects:

```
ecommerce-backend/    → REST API (Node + Express + MongoDB + JWT)
ecommerce-frontend/   → React + Tailwind storefront and admin panel
```

Each has its own `README.md` with full setup instructions — start there.

## Quick Start (local)

**1. Backend**
```bash
cd ecommerce-backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (MongoDB Atlas) and JWT_SECRET
npm run seed      # creates demo admin/customer + sample catalog
npm run dev        # http://localhost:5000
```

**2. Frontend** (new terminal)
```bash
cd ecommerce-frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev        # http://localhost:5173
```

**3. Log in**
- Admin: `admin@example.com` / `admin123` (access `/admin/products` to add/update/delete/view products)
- Customer: `customer@example.com` / `customer123`

## What's implemented against the brief

| Requirement | Status |
|---|---|
| JWT auth (register/login/logout) | ✅ |
| Customer role: browse, search, filter, cart, checkout, order history | ✅ |
| Admin role: dashboard, products, categories, orders CRUD | ✅ |
| Admin product management (add/update/delete/view products) | ✅ |
| Admin dashboard stats + charts | ✅ (totals, pending/delivered, revenue, monthly trend bar chart) |
| Product fields (name, description, category, price, stock, image, brand, status) | ✅ |
| Search / category / price / availability filters + sort + pagination | ✅ |
| Product detail with related products | ✅ |
| Cart (add/remove/update qty/total/empty) | ✅ |
| Checkout — Cash on Delivery | ✅ |
| Order management (place, history, detail, admin status update, cancel with restock) | ✅ |
| Responsive UI | ✅ |
| Validation + error handling | ✅ |
| Clean architecture / modular code / env vars / protected routes | ✅ |
| Manage Users (bonus) | ✅ |
| Role-Based Access Control (bonus) | ✅ |

**Not included** (require live infrastructure I don't have access to in this environment — see "What you still need to do"):
- Image upload via Cloudinary (image URLs are supported instead — paste any hosted image URL when adding a product)
- Email notifications, forgot password, coupons, wishlist, reviews — left as optional bonus features per the brief

## What you still need to do

I built and validated the apps locally, but I could not deploy them from this environment. To complete your submission you should still:

1. **Provision MongoDB Atlas** and update the backend `.env` with `MONGO_URI`
2. **Push to GitHub** — create public repos for `ecommerce-backend` and `ecommerce-frontend`
3. **Deploy** the backend to Render/Railway and the frontend to Vercel/Netlify
4. **Record the 5-minute Loom demo** showing authentication, admin workflows, cart/checkout flow, and deployment links

Suggested order: run both apps locally first and click through every flow (register → browse → cart → checkout → order history, then log in as admin → dashboard → manage products/categories/orders/users) to catch anything environment-specific, *then* push and deploy.

## Deliverables checklist (per the brief)

- [ ] Backend GitHub repo (public)
- [ ] Frontend GitHub repo (public)
- [ ] Live backend URL
- [ ] Live frontend URL
- [ ] READMEs (provided — update with your live links once deployed)
- [ ] 5-minute Loom walkthrough

## Deployment links

- Backend live URL: `https://<your-backend-service>.onrender.com/api`
- Frontend live URL: `https://<your-frontend-app>.vercel.app`

Replace these after deploying the apps.
