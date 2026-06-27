# 🛍️ BazarGhar — Premium E-Commerce Platform

![BazarGhar Cover](https://via.placeholder.com/1200x630/0a0a0a/ffffff?text=BazarGhar+-+Premium+E-Commerce)

> **Har Zaroorat Ek Jagah** 
> An elegant, full-stack e-commerce platform built with the MERN stack, designed to deliver a seamless and premium shopping experience.

---

## ✨ Features

- **🎨 Premium Design System**: Crafted with custom Tailwind CSS tokens (`surface`, `primary`, `brand`, `secondary`, `success`, `error`) for a cohesive, modern, and glassmorphism-inspired aesthetic.
- **🔐 Authentication**: Secure user registration, login, and profile management using JWT.
- **🛒 Shopping Cart & Checkout**: Intuitive cart management with a slide-out drawer, real-time total calculation, and a seamless checkout process.
- **🎟️ Coupon System**: Fully functional discount code system (e.g., `WELCOME10`, `SAVE20`, `FREESHIP`) with instant validation and UI feedback.
- **❤️ Wishlist**: Save favorite products across sessions, synced with the user profile.
- **📦 Order Management**: Comprehensive order tracking, status updates (Pending, Confirmed, Delivered, Cancelled), and detailed order history.
- **🔍 Advanced Search & Filtering**: Robust product discovery with search functionality and category-based filtering.
- **📱 Responsive Layout**: Flawless experience across desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens & glassmorphism utilities
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: React Router DOM
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`)
- **Notifications**: React Hot Toast

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Environment Management**: dotenv

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance (local or Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/BazarGhar.git
cd BazarGhar
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```text
BazarGhar/
├── backend/                  # Express/Node.js Server
│   ├── config/               # Database configuration
│   ├── controllers/          # Route handlers (auth, products, orders, wishlist)
│   ├── middleware/           # Auth and error handling middleware
│   ├── models/               # Mongoose schemas (User, Product, Order, Wishlist)
│   ├── routes/               # API endpoint definitions
│   ├── scripts/              # Database seeding scripts
│   └── server.js             # Entry point
│
└── frontend/                 # React Application (Vite)
    ├── src/
    │   ├── assets/           # Images, SVGs, global CSS
    │   ├── components/       # Reusable UI components (Navbar, ProductCard, etc.)
    │   ├── context/          # React Context (Auth, Cart, Wishlist)
    │   ├── pages/            # Page views (Home, Products, Profile, Checkout, etc.)
    │   ├── services/         # API integration logic
    │   └── styles/           # Tailwind and custom CSS (main.css)
    ├── tailwind.config.js    # Design system tokens
    └── package.json
```

---

## 🎨 Design System Tokens

BazarGhar uses a strict design token system configured in `tailwind.config.js` to ensure visual consistency:

- **Surface Colors**: `surface`, `surface-white`, `surface-secondary`
- **Text/Brand Colors**: `primary`, `secondary`, `brand`, `brand-hover`
- **Feedback Colors**: `success`, `error`, `warning`
- **Borders**: `border`
- **Glassmorphism**: Custom `.glass`, `.glass-white`, `.glass-dark` utilities in `main.css`.

---

## 👨‍💻 Contributing

Contributions are welcome! If you'd like to improve BazarGhar:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
