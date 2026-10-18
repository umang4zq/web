# 👔 The House of Wear

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Netlify-00ad9f?style=for-the-badge&logo=netlify)](https://thehouseofwear.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**The House of Wear** is a full-stack, luxury multi-brand men's fashion e-commerce marketplace built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Prisma ORM**. It features a modern shopping storefront, real-time catalog filtering, cart & checkout workflows, user profile order tracking, and a dedicated **Admin Pro Management Dashboard**.

🌐 **Live URL:** [https://thehouseofwear.netlify.app](https://thehouseofwear.netlify.app)

---

## 🌟 Key Features

### 🛍️ Customer Storefront
* **Luxury UI & Editorial Design:** High-contrast typography, interactive hero banners, and dynamic brand marquee tickers.
* **Product Catalog & Filtering:** Browse by categories (Shirts, T-Shirts, Jeans, Jackets, Shoes, Accessories) and luxury designer brands.
* **Instant Product Search:** Live keyword querying across names, categories, and descriptions.
* **Product Detail Pages:** Multi-angle image preview, size selection, stock availability, and detailed specifications.
* **Session Cart & Checkout:** Persistent shopping cart with quantity adjustments and an integrated shipping address and order summary checkout.
* **User Authentication & Accounts:** Secure registration, login, and user profile management with order history and tracking.

### 🛡️ Admin Pro Management Panel
* **Live Overview Dashboard:** Key metrics counter tracking total registered users, catalog products, and customer orders.
* **Product Catalog CRUD:** Create new luxury products, upload imagery, update stock, set pricing and discount offers.
* **Order Tracking & Fulfillment:** View customer order details, manage fulfillment status, and monitor order dates.
* **Admin Security:** Protected route layouts with cookie-based session verification.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React Server Components) |
| **Frontend** | React 19, TypeScript, Vanilla CSS, Bootstrap 5 & Bootstrap Icons |
| **Database & ORM** | SQLite with Prisma ORM (configured with multi-platform binary targets) |
| **Authentication** | Cryptographic hash validation (PBKDF2 SHA-256) with secure HTTP-only cookies |
| **Cloud Deployment** | Netlify Edge / AWS Lambda Serverless runtime with automated `/tmp` database mapping |

---

## 🏛️ Database Architecture

The relational data model is managed via Prisma schema (`prisma/schema.prisma`):

* `User`: Customer profiles, contact numbers, and delivery addresses.
* `Admin`: Administrator access credentials for the management panel.
* `Brand`: Designer luxury labels and brand logos.
* `Category`: Men's fashion collections and featured visuals.
* `Product`: Catalog items, price tiers, discount rates, inventory stock, and brand/category relationships.
* `Order` & `OrderItem`: Customer orders, payment status, delivery tracking, and line items.

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: v20 or higher
* **npm** (or `pnpm` / `yarn`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/umang4zq/web.git
   cd web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file from `.env.example`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

---

## 🔑 Default Admin Access

To access the back-office admin management portal:
* **URL:** `/admin/login` (or `/admin` when authenticated)
* **Username:** `admin`
* **Password:** `admin123`

*(To regenerate or reset the admin user locally, run `node add_admin.js`).*

---

## ☁️ Deployment Architecture (Netlify)

This application is optimized for zero-downtime deployment on **Netlify**:
* **`netlify.toml`** automatically configures `npm run build` and runs `prisma generate` prior to bundling.
* **Serverless Compatibility:** The database layer incorporates automatic cold-start synchronization to `/tmp/dev.db` to work with serverless read/write execution environments.
* **Edge Routing:** Route assets and images are delivered via Netlify Edge CDN.

---

## 📄 License
This project was developed for educational and portfolio demonstration purposes. All rights reserved.
