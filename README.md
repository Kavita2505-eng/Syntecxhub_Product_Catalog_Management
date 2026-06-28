# Syntecxhub Product Catalog Management

A production-ready, clean, and professional Full-Stack Product Catalog Management system designed for a Web Development Internship. This application showcases industry-standard software architecture, secure authentication, complex search/filter query generation, and real-time MongoDB aggregate analytics, wrapped in a minimalist, Stripe-inspired clean user interface.

## Tech Stack

*   **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose
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
*   **Automatic SKU Normalization**: All SKUs are automatically capitalized and indexed.
*   **Database Constraints**: Schema enforces unique SKUs, non-negative pricing, and integer stock counts.

### 🔍 Advanced Query Builder (Search, Filter, Sort, Paginate)
*   **Global Text Search**: Searches matching name, SKU, or description dynamically (debounced to save bandwidth).
*   **Multi-select Filters**: Filter by categories, price range thresholds (Min/Max), and availability stock statuses (In Stock, Low Stock < 10, Out of Stock).
*   **Dynamic Sorting**: Sort tables by Product Name, Price, Stock count, or Creation date.
*   **Pagination Controls**: Client-defined limits (10, 25, 50 items/page) with full pagination navigators.

### 📊 MongoDB Aggregation Dashboard
*   Dynamic stats cards displaying:
    *   **Total Products**
    *   **Unique Categories**
    *   **Total Inventory Asset Value** ($\sum (\text{price} \times \text{stock})$)
    *   **Low Stock Count** (items with stock < 10)
*   **Category Distribution**: Detailed breakdown showing product counts and inventory values dynamically calculated via a single facet aggregate pipeline.

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
│   ├── config/             # DB & Swagger setups
│   ├── controllers/        # Route controllers (Auth, Products)
│   ├── middleware/         # Auth verification, Central error handler
│   ├── models/             # Mongoose schemas (User, Product)
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
*   MongoDB Instance (Atlas URI or Local Mongoose Server)

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
4.  Update your environment keys:
    *   `PORT`: Server listener port (default 5000)
    *   `MONGODB_URI`: Connect string to MongoDB Atlas
    *   `JWT_SECRET`: Minimum 32 characters key
    *   `CORS_ORIGIN`: Front-end origin URL (`http://localhost:5173`)
5.  Start the developer backend server:
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

### Summary Endpoints

#### Authentication (`/api/auth`)
*   `POST /register` - Register a new user account.
*   `POST /login` - Authenticate email/username and get JWT token.
*   `GET /me` - Get profile details of the currently authorized user (Requires token).

#### Product Catalog (`/api/products`)
*   `GET /` - Retrieve paginated list of products matching search, filter, and sorting queries.
*   `GET /stats` - Generate aggregation statistics for dashboard cards.
*   `GET /:id` - Fetch details for a single product record.
*   `POST /` - Add a new product (Requires token & validator check).
*   `PUT /:id` - Modify parameters for an existing product (Requires token & validator check).
*   `DELETE /:id` - Remove a product record from database (Requires token).

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
5.  Add the environment keys (`MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, etc.) in the **Environment** settings.

### Frontend (Vercel)
1.  Deploy a project on [Vercel](https://vercel.com/).
2.  Set **Root Directory** to: `frontend`
3.  Vercel will auto-detect Vite settings. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4.  Add the environment variable `VITE_API_URL` pointing to your deployed Render backend url (e.g. `https://your-service.onrender.com/api`).

---

## Future Improvements
*   **Roles & Permissions**: Introduce manager/admin roles where only certain operators can write changes.
*   **Audit Logging**: Maintain history tables tracking which user changed which field on each product.
*   **Bulk CSV Upload**: Enable batch creation of product records from Excel/CSV uploads.
