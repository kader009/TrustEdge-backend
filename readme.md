# TrustEdge Backend - Product Review Platform API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Express](https://img.shields.io/badge/Express-5.1-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.18-green)

**Production-ready REST API for product review platform with voting, nested comments, and admin moderation.**

</div>

---

## 🎯 Overview

REST API with 54 endpoints featuring authentication, product/category management, review system with voting, nested comments, and admin moderation.

**Features:** JWT Auth • Role-Based Access • 100% Zod Validation • Voting System • Nested Comments • Admin Moderation • Advanced Search

---

## Tech Stack

**Core:** Node.js v22, TypeScript v5.8, Express v5.1, MongoDB v6.18, Mongoose v8.14  
**Auth:** JWT, bcrypt, cookie-parser  
**Validation:** Zod v3.24 (38 schemas)  
**Payment:** SSLCommerz v1.2

---

## ⚙️ Quick Start

```bash
# Clone & Install
git clone https://github.com/kader009/TrustEdge-backend.git
cd TrustEdge-backend
npm install

# Configure
cp .env.example .env
# Edit .env with your settings

# Run
npm run dev          # Development
npm run build        # Production build
npm run start:prod   # Production server
```

### Environment Setup

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/trustedge
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=365d
CLIENT_URL=http://localhost:3000
```

---

## API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

### 🔐 Authentication (4)

```
POST   /auth/register         # Register
POST   /auth/login            # Login
POST   /auth/refresh-token    # Refresh token
POST   /auth/logout           # Logout
```

### Users (7)

```
GET    /users/me                        # Get profile
PUT    /users/update-profile            # Update profile
PATCH  /users/update-password           # Change password
GET    /users/admin/all-users           # All users (Admin)
GET    /users/admin/:id                 # Single user (Admin)
PUT    /users/admin/update-user/:id     # Update user (Admin)
DELETE /users/delete-user/:id           # Delete user (Admin)
```

### Products (8)

```
GET    /products                        # All products
GET    /products/filters                # Filter options
GET    /products/:slug                  # By slug
GET    /products/admin/all-products     # All (Admin)
GET    /products/admin/:id              # By ID (Admin)
POST   /products/create-product         # Create (Admin)
PUT    /products/update-product/:id     # Update (Admin)
DELETE /products/:id                    # Delete (Admin)
```

### Categories (6)

```
GET    /categories                      # All categories
GET    /categories/admin/all-categories # All (Admin)
GET    /categories/:id                  # Single (Admin)
POST   /categories/create-category      # Create (Admin)
PUT    /categories/:id                  # Update (Admin)
DELETE /categories/:id                  # Delete (Admin)
```

### Reviews (14)

```
# Public
GET    /reviews                         # All approved
GET    /reviews/:id                     # Single review
GET    /reviews/search/reviews          # Search & filter
GET    /reviews/premium/all             # Premium reviews
GET    /reviews/preview/:id             # Preview

# User
POST   /reviews                         # Create
PATCH  /reviews/:id                     # Update
DELETE /reviews/:id                     # Delete

# Admin
GET    /reviews/admin/pending           # Pending reviews
GET    /reviews/admin/status/:status    # By status
PATCH  /reviews/admin/approve/:id       # Approve
PATCH  /reviews/admin/unpublish/:id     # Unpublish
POST   /reviews/admin/recalculate-all   # Recalculate all
POST   /reviews/admin/recalculate/:productId  # Recalculate product
```

### Votes (6)

```
POST   /votes/upvote                    # Upvote
POST   /votes/downvote                  # Downvote
DELETE /votes/remove/:reviewId          # Remove vote
GET    /votes/counts/:reviewId          # Vote counts
GET    /votes/user/:reviewId            # User vote
GET    /votes/review/:reviewId          # All votes
```

### Comments (9)

```
POST   /comments                        # Create
GET    /comments/review/:reviewId       # Review comments
GET    /comments/:id                    # Single comment
GET    /comments/replies/:commentId     # Replies
PUT    /comments/:id                    # Update
DELETE /comments/:id                    # Delete (soft)
DELETE /comments/hard-delete/:id        # Delete (hard) (Admin)
GET    /comments/count/:reviewId        # Count
GET    /comments/user/my-comments       # User comments
```

---

## Database Models

**User:** name, email, password, role, avatar  
**Product:** name, slug, price, category, stock, images  
**Category:** name, slug, parent, order (hierarchical)  
**Review:** title, description, rating (1-5), status, images  
**Vote:** user, review, voteType (upvote/downvote)  
**Comment:** text, review, parentComment, replies (nested)

---

## Security

1. JWT authentication (access + refresh tokens)  
2. bcrypt password hashing  
3. HTTP-only secure cookies  
4. Role-based access control  
5. 100% Zod validation (38 schemas)  
6. CORS configuration  
7. MongoDB injection protection

---

## Response Format

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message",
  "errorMessages": [{ "path": "field", "message": "Validation error" }]
}
```

**Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

---

## Roadmap

**Current (98%):** Auth, User/Product/Category Management, Review System, Voting, Comments, Moderation, Validation

**Next (2%):** SSLCommerz Payment Integration

**Future:** Real-time Notifications, Email Service, File Upload, Rate Limiting, API Docs (Swagger), Tests, Caching

---

## Author

**Kader** • [GitHub](https://github.com/kader009) • [Repository](https://github.com/kader009/TrustEdge-backend)

---

<div align="center">

**Built with Node.js, TypeScript, Express, and MongoDB**
 Star this repo if you find it helpful!

</div>
