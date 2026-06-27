<<<<<<< HEAD
# BazarGhar - Har Zaroorat Ek Jagah

![BazarGhar Banner](https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000&auto=format&fit=crop)

BazarGhar is a modern, full-stack e-commerce platform engineered for a premium user experience. Built on the MERN stack (MongoDB, Express, React, Node.js), it offers a seamless shopping journey with features like secure authentication, dynamic product browsing, intuitive category filtering, robust cart management, and a responsive, aesthetic design.

---

## 🚀 Features

- **Secure User Authentication:** Registration and login functionality protected by JWT (JSON Web Tokens).
- **Premium UI/UX:** Responsive, aesthetic interface with dynamic micro-animations utilizing Framer Motion and Tailwind CSS.
- **Product Discovery:** Advanced product browsing with real-time search and category filtering.
- **Cart & Checkout Management:** Persistent shopping cart and simulated checkout flows.
- **Performance Optimized:** Lazy loading of images and route-based code splitting for minimal bundle sizes and fast page loads.
- **User Dashboard:** Comprehensive user profiles to track order history and account details.

---

## 📸 Screenshots

*(Replace placeholder links with actual application screenshots)*

| Home Page | Product Listing |
| :---: | :---: |
| ![Home](https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80) | ![Products](https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80) |

| Product Details | Shopping Cart |
| :---: | :---: |
| ![Details](https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80) | ![Cart](https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80) |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS, PostCSS
- **Animations:** Framer Motion
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT, bcryptjs

---

## 📁 Folder Structure

```text
BazarGhar/
├── backend/                    # Node.js + Express API
│   ├── config/                 # Database and server configs
│   ├── controllers/            # Business logic (auth, products, orders)
│   ├── middleware/             # Error handling, Auth verification
│   ├── models/                 # Mongoose schema definitions
│   ├── routes/                 # API endpoint definitions
│   ├── scripts/                # Database seeding scripts
│   └── server.js               # Application entry point
│
├── frontend/                   # React Client
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Global state (Cart, Auth)
│   │   ├── pages/              # Route-based page components
│   │   ├── services/           # Axios API configuration
│   │   └── App.jsx             # Main router configuration
│   └── vercel.json             # Vercel deployment configuration
└── README.md
```

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Kaustav1409/BazarGhar.git
cd BazarGhar
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Optional: Seeds the database with premium mock data
npm run dev      # Starts the development server on port 5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts the Vite development server
```

The application will be accessible at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create `.env` files in both the frontend and backend directories. Use the provided `.env.example` files as a template.

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bazarghar
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
# URL for the backend API
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Deployment Guide

This project is fully configured for modern deployment platforms.

### Frontend Deployment (Vercel)
1. Import the repository into Vercel.
2. Set the framework preset to **Vite**.
3. Add the Environment Variable `VITE_API_BASE_URL` pointing to your production backend API.
4. The included `vercel.json` ensures that React Router works seamlessly.

### Backend Deployment (Render / Heroku)
1. Create a new Web Service on Render and connect the repository.
2. Set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add the necessary Environment Variables (see section above), ensuring `CLIENT_URL` is set to your deployed Vercel domain.

---

## 🔮 Future Enhancements

- Integrate a real payment gateway (Stripe / Razorpay).
- Build an admin dashboard for inventory and order management.
- Add product reviews and rating systems.
- Implement advanced product search with Elasticsearch or Algolia.

---

## 👨‍💻 Author

**Kaustav Ghosh**
- GitHub: [@Kaustav1409](https://github.com/Kaustav1409)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
=======
# BazarGhar
BazarGhar is a premium full-stack eCommerce platform built with the MERN stack, featuring secure JWT authentication, product catalog, advanced search, shopping cart, wishlist, order management, responsive UI, and a modern luxury shopping experience.
>>>>>>> 6a4156d49c5139fec120acfe76c4a789dac446e5
