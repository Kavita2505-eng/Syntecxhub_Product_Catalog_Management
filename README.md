# Syntecxhub Product Catalog Management

[![Demo Status](https://img.shields.io/badge/Demo%20Mode-Active%20(In--Memory)-brightgreen?style=flat-square)](https://github.com/)
[![React Version](https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.x-purple?style=flat-square&logo=vite)](https://vite.dev/)
[![Node Version](https://img.shields.io/badge/Node.js-24.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Tailwind Version](https://img.shields.io/badge/Tailwind%20CSS-4.x-blueviolet?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square)](https://opensource.org/licenses/ISC)

A production-quality, clean, and highly maintainable Full-Stack Product Catalog Management system designed for a Web Development Internship. This project is built following strict industry folder structures and features robust security controls, dynamic search, multi-faceted filtering, sorting, pagination, and a master dashboard built on in-memory JS query adapters.

> [!IMPORTANT]
> **DEMO VERSION HIGHLIGHTS**: 
> * **Zero Configuration**: This project runs entirely in **Demo Mode** using a high-performance in-memory JavaScript data store. No MongoDB Atlas configuration, installation, or environment setup is required!
> * **Master Login Bypass**: Enter **any** email/username and password in the login window to authenticate instantly.
> * **Auto-Registration**: If you type credentials that aren't registered yet, the system dynamically signs you up and generates a valid JWT token on the fly.
> * **Pre-Seeded Catalog**: Includes pre-populated seed data representing hardware parts and accessories on boot to demonstrate aggregates and inventory health immediately.

---

## 🛠️ Technology Stack

| Layer | Technology | Badge |
|---|---|---|
| **Frontend** | React (v19) | `React.js` `Vite` |
| **Styling** | Tailwind CSS (v4) | `Tailwind` `Inter Font` |
| **Icons** | Lucide React | `Lucide Icons` |
| **Backend** | Node.js + Express.js | `Express` `Node` |
| **Authentication** | JSON Web Tokens | `JWT` `Bcrypt.js` |
| **API Docs** | Swagger UI (OpenAPI 3.0) | `OpenAPI` `Swagger` |

---

## 🚀 Key Features

*   **🔒 Session Security**: Full password encryption (Bcrypt.js), protected private layouts, and security headers (Helmet, CORS, IP rate-limiting).
*   **🔍 Search & Filters**: Debounced search checking SKU, title, and description, category sorting, price threshold bounds, and stock states.
*   **📊 Aggregate Metrics**: Dashboard cards tracking asset values, average prices, low stock products, and category-wise product distribution.
*   **📂 UI Skeletons & Boundaries**: Loading states for tables/details sheets, custom toast alerts, and a global React error boundary to handle runtime exceptions.

---

## 📁 Folder Structure

```
Syntecxhub_Product_Catalog_Management/
├── backend/
│   ├── config/             # Swagger UI OpenAPI setup
│   ├── controllers/        # Express controllers (Auth, Products)
│   ├── middleware/         # JWT verification, centralized error handler
│   ├── models/             # In-memory arrays & models (User, Product, store)
│   ├── routes/             # Router mappings with OpenAPI specs
│   ├── validators/         # Input checkers using express-validator
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/     # Layouts, Skeletons, Error boundary, Custom Toasts
│   │   ├── context/        # Auth & Toast notification providers
│   │   ├── hooks/          # useDebounce hook
│   │   ├── pages/          # Login, Register, Dashboard, Products, Forms, 404
│   │   ├── services/       # Fetch API client wrapper
│   │   ├── App.jsx         # Router setup
│   │   ├── index.css       # Tailwind v4 theme configurations
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── postman_collection.json
```

---

## ⚙️ Quick Installation

### Backend Setup
1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install the lightweight packages:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```
   *The server will start up on `http://localhost:5000`*.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the bundler:
   ```bash
   npm run dev
   ```
   *Vite will launch on `http://localhost:5173/`*.

---

## 📖 API Documentation & Testing

### Swagger Documentation
Verify and test endpoints interactively by visiting:
👉 **`http://localhost:5000/api-docs`**

### Pre-Seeded Default Operator (Optional)
If you want to use the default seeded user:
*   **Email**: `operator@syntecxhub.com`
*   **Password**: `securePassword123`
*(Otherwise, type any credentials you prefer to register/login instantly).*

### Postman Collections
A fully configured collection is included at the root: [postman_collection.json](./postman_collection.json). It features JavaScript token capture scripts to automate collection variable bindings.

---

## ☁️ Deployment Guide

*   **Render (Backend)**: Add a Web Service pointing to `backend/`. Use `cd backend && npm install` as the build command and `cd backend && npm start` as the start command. Add the required `JWT_SECRET` keys in settings.
*   **Vercel (Frontend)**: Deploy pointing to the `frontend/` directory with build command `npm run build` and output directory `dist`. Link the `VITE_API_URL` pointing to your Render server URL.

---

## 👨‍💻 Author

**Kavita Kumari**
- LinkedIn:- https://www.linkedin.com/in/kavita-singh-b5b97a367/
- GitHub: https://github.com/Kavita2505-eng
- Project Repository: https://github.com/Kavita2505-eng/Syntecxhub_Product_Catalog_Management

---

## 🙏 Acknowledgements

This project was developed as part of the **Syntecxhub Web Development Internship Program**.

It demonstrates the implementation of a Product Catalog Management System based on the internship requirements, including RESTful API development, search functionality, pagination, secure endpoints, and input validation.

---

## 📄 License

This project is created for educational and internship purposes.
