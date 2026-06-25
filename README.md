<div align="center">
  <img src="./frontend/public/logo.png" alt="BazarGhar Logo" width="150" />
  <h1>BazarGhar - E-Commerce Platform</h1>
  <p>A modern, full-stack e-commerce application with a premium shopping experience.</p>

  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
</div>

---

## 🌟 Overview

BazarGhar is a complete e-commerce solution built with the **MERN** stack (MongoDB, Express, React, Node.js). It offers a seamless user interface, fast page loads with Vite, secure authentication, robust cart management, and order tracking.

## ✨ Features

- **User Authentication**: Secure registration and login using JWT tokens.
- **Product Management**: Browse, search, and filter products easily.
- **Shopping Cart**: Dynamic cart management for adding/removing items.
- **Order Management**: Checkout process and track past orders.
- **Responsive Design**: Beautiful, mobile-friendly interface built with modern CSS and Tailwind.
- **RESTful API**: Clean and scalable backend architecture.

## 🚀 Technologies Used

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- CSS3 & Tailwind CSS
- Framer Motion

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)

## 📂 Project Structure

```text
BazarGhar/
├── backend/                    # Node.js API Server
│   ├── config/                 # DB configuration
│   ├── controllers/            # Route controllers
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   └── server.js               # Entry point
│
├── frontend/                   # React App
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main application pages
│   │   ├── services/           # API integration
│   │   └── context/            # React context state
│   └── vite.config.js          # Vite config
```

## 🛠️ Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bazarghar
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
Start the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory (copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```
Your app will be running at `http://localhost:5173`.

## 🌐 Deployment Guidelines

The project is fully configured for cloud deployment.
- **Frontend (Vercel/Netlify)**: Point your build settings to the `frontend` folder, build command `npm run build`, and publish directory `dist`. Set the `VITE_API_BASE_URL` environment variable to your deployed backend URL.
- **Backend (Render/Heroku)**: Point your build settings to the `backend` folder, set start command to `npm start`. Ensure you add your MongoDB Atlas URL and JWT Secret in the environment variables dashboard.

## 📝 API Endpoints Summary

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/products` - Fetch products
- `POST /api/orders` - Place a new order

## 📄 License
This project is licensed under the MIT License.
