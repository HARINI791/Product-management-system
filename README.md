# Product Management System

A full-stack web application for managing products with CRUD operations, built with React, Node.js, and MongoDB.

## Features

### Frontend (React)
- ✅ Product List Page: Display all products in a responsive grid layout
- ✅ Add Product Form: Create new products with validation
- ✅ Product Card Component: Reusable component showing product information
- ✅ Edit existing products
- ✅ Delete products with confirmation dialog
- ✅ Sort products by price (ascending/descending)
- ✅ Search products by name
- ✅ Responsive design with modern UI
- ✅ Form validation and error handling

### Backend (Node.js)
- ✅ RESTful API endpoints
- ✅ Express.js server
- ✅ MongoDB integration with Mongoose
- ✅ Error handling middleware
- ✅ CORS support

### Database (MongoDB)
- ✅ Product schema with all required fields:
  - name (required)
  - productId (required, unique)
  - price (required)
  - category (required)
  - discount (optional, 0-100%)
  - description (required)
- ✅ Timestamps for created/updated dates

## API Endpoints

- `GET /api/products` - Get all products (supports search and sort)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd productmanagement
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/productmanagement
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the database and collections when you add your first product.

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Add new products using the "Add New Product" button
3. Search for products using the search bar
4. Sort products by price using the dropdown
5. Edit products by clicking the "Edit" button on any product card
6. Delete products by clicking the "Delete" button (with confirmation)

## Project Structure

```
productmanagement/
├── backend/
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── products.js
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductForm.js
│   │   │   └── ConfirmationModal.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Technologies Used

- **Frontend**: React 18, Axios, CSS3
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Development**: Nodemon, React Scripts

## Features Implemented

### Must Have Features ✅
- [x] Display list of products
- [x] Add new product via form
- [x] Delete product (with confirmation)
- [x] Sort Products by Price
- [x] Connect all three technologies successfully
- [x] Edit existing product
- [x] Search products by name
- [x] Basic form validation

### Additional Features ✅
- [x] Responsive design
- [x] Modern UI with gradients and animations
- [x] Discount calculation and display
- [x] Error handling and user feedback
- [x] Loading states
- [x] Success/error messages
- [x] Form validation with real-time feedback
- [x] Unique product ID validation
- [x] Price formatting with currency
- [x] Category badges
- [x] Discount badges

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts React development server
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
