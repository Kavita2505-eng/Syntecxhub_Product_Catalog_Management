# Syntecxhub Product Catalog Management (Demo Version)

> [!NOTE]
> **DEMO MODE ACTIVE**: This project runs entirely in **Demo Mode** utilizing an in-memory data layer. No MongoDB installation, Atlas registration, or database connection keys are required! The system is pre-seeded with mockup operator credentials and product records on startup. Note that data modifications will reset when the backend process restarts.

A production-quality, clean, and professional Full-Stack Product Catalog Management system designed for a Web Development Internship. This application showcases industry-standard software architecture, secure authentication, complex search/filter queries, and live dashboard analytics, wrapped in a minimalist, Stripe-inspired clean user interface.

## Tech Stack

*   **Backend**: Node.js, Express.js, In-Memory Data Store
*   **Frontend**: React, Vite, Tailwind CSS, Lucide React
*   **Authentication**: JSON Web Token (JWT), Bcrypt.js (for password hashing)
*   **Documentation**: Swagger UI (OpenAPI 3.0)
*   **Security**: Helmet, CORS, Express Rate Limiter, express-validator

---

## Features

### 🔐 Authentication & Session Security
*   **Registration & Login**: Secure account registration and email/username authentication.
*   **JWT Protection**: Private routes on the backend require a bearer token in the headers.
*   **Bcrypt Hashing**: Safe, encrypted storage of passwords with round 10 salts.
*   **Security Middlewares**: Helmet headers, custom CORS configuration, and request rate-limiting to prevent brute force.

### 📦 Product Inventory Management
*   **Full CRUD Lifecycle**: Logged-in operators can create new products, update existing specifications, and delete records.
*   **Automatic SKU Normalization**: All SKUs are automatically capitalized and validated.
*   **Data Validation**: Enforces unique SKUs, non-negative pricing, and integer stock counts.

### 🔍 Advanced Query Builder (Search, Filter, Sort, Paginate)
*   **Global Text Search**: Searches matching name, SKU, or description dynamically (debounced to save bandwidth).
*   **Multi-select Filters**: Filter by categories, price range thresholds (Min/Max), and availability stock statuses (In Stock, Low Stock < 10, Out of Stock).
*   **Dynamic Sorting**: Sort tables by Product Name, Price, Stock count, or Creation date.
*   **Pagination Controls**: Client-defined limits (10, 25, 50 items/page) with full pagination navigators.

### 📊 In-Memory Aggregation Dashboard
*   Dynamic stats cards displaying:
    *   **Total Products**
    *   **Unique Categories**
    *   **Total Inventory Asset Value** ($\sum (\text{price} \times \text{stock})$)
    *   **Low Stock Count** (items with stock < 10)
*   **Category Distribution**: Detailed breakdown showing product counts and inventory values dynamically calculated via clean JavaScript aggregate filters.

### ⚡ UX & UI Robustness
*   **Toast Notifications Context**: Light-weight, custom React toast engine showing success and error operations.
*   **Loading Skeletons**: Tailored loaders for tables, cards, and details views.
*   **Error Boundary**: Safe catching of front-end crashes.
*   **Empty States**: Illustrated helpers when queries return zero results.

---

## Folder Structure

```
Syntecxhub_Product_Catalog_Management/
├── backend/
│   ├── config/             # Swagger setups
│   ├── controllers/        # Route controllers (Auth, Products)
│   ├── middleware/         # Auth verification, Central error handler
│   ├── models/             # In-memory arrays & models (User, Product, store)
│   ├── routes/             # Router mappings with OpenAPI specs
│   ├── validators/         # Input checkers using express-validator
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/     # Layouts, Skeletons, Error boundary, Custom Toasts
│   │   ├── context/        # Auth & Toast notification providers
│   │   ├── hooks/          # useDebounce, etc.
│   │   ├── pages/          # Login, Register, Dashboard, Products, Forms, 404
│   │   ├── services/       # Unified Fetch API wrapper
│   │   ├── App.jsx         # Router switch setup
│   │   ├── index.css       # Custom scrolls and table resets
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── postman_collection.json
```

---

## Installation & Setup

### Prerequisites
*   Node.js (v16+)

### Backend Configuration
1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure variables. Copy `.env.example` into a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
    *(Note: MONGODB_URI is not used or required in this Demo Version).*
4.  Start the developer backend server:
    ```bash
    npm run dev
    ```

### Frontend Configuration
1.  Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite bundler server:
    ```bash
    npm run dev
    ```
4.  Open the address in your browser: `http://localhost:5173`

---

## API Documentation (Swagger OpenAPI 3.0)

Once the backend server is running, you can inspect the interactive swagger page at:
👉 **`http://localhost:5000/api-docs`**

### Pre-Seeded Default Operator Credentials
For immediate testing on Swagger or the Login screen, you can use:
*   **Email**: `operator@syntecxhub.com`
*   **Password**: `securePassword123`

---

## API Testing (Postman)

A preconfigured Postman collection is supplied at the root folder: [postman_collection.json](./postman_collection.json).
Import it directly into your Postman client. It contains templates for all Auth and Product actions.
> **Tip**: The login and register requests automatically save the returned JWT token to a Postman collection variable, meaning subsequent protected requests will run immediately without copy-pasting headers!

---

## Deployment Guide

### Backend (Render)
1.  Create a web service on [Render](https://render.com/).
2.  Connect your GitHub repository.
3.  Set **Build Command** to: `cd backend && npm install`
4.  Set **Start Command** to: `cd backend && npm start`
5.  Add the environment keys (`JWT_SECRET`, `CORS_ORIGIN`, etc.) in the **Environment** settings.

### Frontend (Vercel)
1.  Deploy a project on [Vercel](https://vercel.com/).
2.  Set **Root Directory** to: `frontend`
3.  Vercel will auto-detect Vite settings. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4.  Add the environment variable `VITE_API_URL` pointing to your deployed Render backend url (e.g. `https://your-service.onrender.com/api`).
