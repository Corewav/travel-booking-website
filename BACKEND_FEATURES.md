# Travel Booking Platform - Enhanced Backend

A comprehensive travel booking system with user authentication, advanced hotel filtering, booking management, reviews & ratings, and admin dashboard.

## 🚀 New Features Implemented

### 1. **User Authentication**

- User signup with email and password
- Secure login with JWT tokens
- User profile management
- Password hashing with bcryptjs
- Token-based authorization for protected routes

**Endpoints:**

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### 2. **Advanced Hotel Filtering**

- Search hotels by location/name
- Filter by price range (minPrice, maxPrice)
- Filter by minimum rating
- Sort options: price-asc, price-desc, rating-asc, rating-desc
- Real-time review counts and average ratings

**Endpoints:**

- `GET /api/hotels/search?location=...&minPrice=...&maxPrice=...&minRating=...&sortBy=...`
- `GET /api/hotels/:id` - Get hotel details with reviews
- `GET /api/amenities` - Get list of available amenities

### 3. **Booking Management**

- Create bookings with automatic total price calculation
- View booking history for each user
- Automatic payment status tracking
- Cancel bookings with 48-hour warning before check-in
- Update booking status (for admin)

**Endpoints:**

- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/user-bookings` - Get user's bookings (requires auth)
- `DELETE /api/bookings/:id/cancel` - Cancel booking (requires auth)
- `POST /api/bookings/payment` - Process payment
- `GET /api/bookings` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update booking status (admin)

### 4. **Reviews & Ratings System**

- Add reviews with 1-5 star ratings
- View hotel reviews with stats
- Edit own reviews
- Delete own reviews
- Mark reviews as helpful
- Average rating calculation
- Rating distribution analysis

**Endpoints:**

- `POST /api/reviews` - Add review (requires auth)
- `GET /api/reviews/hotel/:hotelId` - Get hotel reviews with stats
- `GET /api/reviews/user/my-reviews` - Get user's reviews (requires auth)
- `PUT /api/reviews/:id` - Update review (requires auth)
- `DELETE /api/reviews/:id` - Delete review (requires auth)
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### 5. **Admin Dashboard**

- View booking statistics (total, confirmed, pending, cancelled)
- View revenue metrics
- Manage hotels (add, edit, delete)
- View all users
- User booking history and details
- Booking analytics and top hotels ranking

**Endpoints:**

- `GET /api/admin/dashboard/stats` - Get dashboard statistics (admin)
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/users/:id` - Get user details with bookings (admin)
- `POST /api/admin/hotels` - Add new hotel (admin)
- `PUT /api/admin/hotels/:id` - Update hotel (admin)
- `DELETE /api/admin/hotels/:id` - Delete hotel (admin)
- `GET /api/admin/bookings/analytics` - Get booking analytics (admin)

### 6. **Input Validation & Error Handling**

- Email format validation
- Password strength requirements (min 6 characters)
- Phone number validation
- Booking date validation
- Review content validation
- Comprehensive error messages
- HTTP status codes for different scenarios

### 7. **Better Code Organization**

```
api/
├── routes/
│   ├── authRoutes.js
│   ├── hotelRoutes.js
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   └── adminRoutes.js
├── controllers/
│   ├── authController.js
│   ├── hotelController.js
│   ├── bookingController.js
│   ├── reviewController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js (JWT authentication)
│   └── validation.js (Input validation)
└── utils/
    └── helpers.js (Utility functions)
```

## 📝 Frontend Pages

### 1. **Auth Page** (`auth.html`)

- Login form
- Signup form
- Token-based authentication
- Form validation and error messages

### 2. **Dashboard** (`dashboard.html`)

- View user profile
- Edit profile information
- View all bookings with status
- Cancel bookings
- Write reviews for hotels
- Logout functionality

### 3. **Review Page** (`reviews-add.html`)

- Star rating selector (1-5)
- Review comment input
- Character counter
- Submit review with validation
- Hotel information display

### 4. **Admin Dashboard** (`admin-dashboard.html`)

- Dashboard statistics (total bookings, revenue, users, hotels)
- Bookings management table
- Hotel management (add, edit, delete)
- Users list and details
- Booking analytics and top hotels

## 🔐 Security Features

- **Password Hashing**: Bcryptjs with salt rounds
- **JWT Authentication**: Token-based user sessions
- **Authorization**: Protected routes with token verification
- **Input Validation**: All inputs validated on server
- **Error Handling**: Secure error messages without sensitive data
- **CORS**: Enabled for cross-origin requests

## 💾 Data Storage

All data is stored in JSON files:

- `data/users.json` - User accounts with hashed passwords
- `data/hotels.json` - Hotel information
- `data/bookings.json` - Booking records
- `data/reviews.json` - User reviews and ratings

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
node server.js
```

The server will start at `http://localhost:3000`

### Accessing the Application

- **Home**: `http://localhost:3000`
- **Login/Signup**: `http://localhost:3000/auth.html`
- **Dashboard**: `http://localhost:3000/dashboard.html`
- **Admin Dashboard**: `http://localhost:3000/admin-dashboard.html`

## 🔑 Default Admin Credentials

To access admin features, you need to be logged in with a user account. Any logged-in user can access admin routes in the current implementation.

**Recommended**: Create an admin user and modify the `isAdmin` middleware in `api/routes/adminRoutes.js` to check for specific role.

## 📊 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "errors": ["Field error 1", "Field error 2"]
}
```

## 🔄 Backward Compatibility

The new structure maintains backward compatibility with old API endpoints:

- `/api/search-hotels` → `/api/hotels/search`
- `/api/hotel-details/:id` → `/api/hotels/:id`
- `/api/book` → `/api/bookings`
- `/api/payment` → `/api/bookings/payment`

## 📦 Dependencies

```json
{
  "cors": "^2.8.6",
  "express": "^5.2.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0"
}
```

## 🎯 Features Summary

| Feature            | Status | Auth Required | Admin Only |
| ------------------ | ------ | ------------- | ---------- |
| Search Hotels      | ✅     | No            | No         |
| Advanced Filtering | ✅     | No            | No         |
| User Signup/Login  | ✅     | -             | No         |
| View Profile       | ✅     | Yes           | No         |
| Create Booking     | ✅     | No            | No         |
| View My Bookings   | ✅     | Yes           | No         |
| Cancel Booking     | ✅     | Yes           | No         |
| Write Reviews      | ✅     | Yes           | No         |
| View Reviews       | ✅     | No            | No         |
| Admin Dashboard    | ✅     | Yes           | Yes        |
| Manage Hotels      | ✅     | Yes           | Yes        |
| Manage Users       | ✅     | Yes           | Yes        |
| Booking Analytics  | ✅     | Yes           | Yes        |

## 🛠️ Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Email notifications
- Payment gateway integration
- Booking modifications
- Multi-language support
- Advanced analytics
- Role-based access control
- Email verification
- Password reset functionality
- User reviews on profile
- Loyalty points system

## 📝 Notes

- Passwords are hashed with 10 salt rounds
- JWT tokens expire in 7 days
- Bookings can be cancelled 48 hours before check-in
- Price is calculated based on number of nights
- Reviews require minimum 5 characters
- All timestamps are in ISO 8601 format

## ✨ Version History

**v2.0.0** - Enhanced Backend Release

- Added user authentication
- Added reviews & ratings
- Added advanced filtering
- Added admin dashboard
- Restructured codebase
- Added validation middleware
- Added error handling

**v1.0.0** - Initial Release

- Basic hotel search
- Simple booking system
- Payment processing

---

Made with ❤️ for travelers
