# BazarGhar - E-commerce Platform

BazarGhar is a full-stack e-commerce application built with **Node.js + Express** for the backend and **React + Vite** for the frontend. The application uses **MongoDB** as its database and provides a complete shopping experience including product browsing, authentication, cart management, and order placement.

## Features

- **User Authentication**: Register and login functionality with JWT tokens
- **Product Management**: Browse products with search and filter capabilities
- **Shopping Cart**: Add/remove products from cart
- **Order Management**: Create and track orders
- **User Profile**: View user information and order history
- **Responsive Design**: Mobile-friendly interface with Bootstrap

## Project Structure

```
BazarGhar/
├── backend/                    # Node.js + Express Backend
│   ├── config/                 # Configuration files
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── controllers/            # Business logic
│   ├── server.js               # Express server entry point
│   ├── .env                    # Environment variables
│   └── package.json            # Backend dependencies
│
├── frontend/                   # React + Vite Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Global state management
│   │   ├── services/           # API service calls
│   │   ├── assets/             # Images and assets
│   │   ├── styles/             # CSS styles
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore rules
└── LICENSE                     # Project license
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bazarghar
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders` - Get user orders (authenticated)
- `GET /api/orders/:id` - Get order by ID (authenticated)
- `PUT /api/orders/:id` - Update order (authenticated)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)

### Frontend
- React 18
- React Router v6
- Vite
- Axios
- CSS3

## Running the Application

1. **Start MongoDB** (if running locally)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. Open browser and navigate to `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bazarghar
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

BazarGhar Development Team

---

**Note**: This is a development project. For production use, ensure proper security measures, authentication, and database backups.
