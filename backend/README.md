# Alumni Management System - Backend API

A complete Node.js/Express backend for the Alumni Management System with MySQL database, JWT authentication, and RESTful API endpoints.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL/Sequelize configuration
│   ├── controllers/
│   │   ├── adminController.js   # Admin dashboard & user management
│   │   ├── authController.js    # Authentication (login, register, etc.)
│   │   ├── requestController.js # Document request CRUD operations
│   │   └── uploadController.js  # File upload handling
│   ├── middleware/
│   │   └── auth.js              # JWT authentication & utilities
│   ├── models/
│   │   ├── AttachedDocument.js  # File attachment model
│   │   ├── DocumentRequest.js   # Document request model
│   │   ├── Payment.js           # Payment model
│   │   ├── Person.js            # Student/Alumni person model
│   │   ├── User.js              # User authentication model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin API routes
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── requestRoutes.js     # Request management routes
│   │   └── uploadRoutes.js      # File upload routes
│   └── index.js                 # Main server entry point
├── scripts/
│   └── setup-database.js        # Database initialization script
├── uploads/                     # Uploaded files directory
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit `.env` file:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=alumni_management
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d

   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Setup database:**
   ```bash
   npm run setup-db
   ```

   This will:
   - Create the database if it doesn't exist
   - Sync all models with the database
   - Create an admin user (email: `admin@bits.edu`, password: `admin123`)
   - Create a sample student (email: `student@bits.edu`, password: `student123`)

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3001`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new student | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Private |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| PUT | `/api/auth/password` | Change password | Private |

### Document Requests

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/requests/track/:trackingNumber` | Track request status | Public |
| POST | `/api/requests` | Create new request | Private |
| GET | `/api/requests/my` | Get student's requests | Student |
| GET | `/api/requests` | Get all requests | Admin |
| GET | `/api/requests/:id` | Get request details | Private |
| PUT | `/api/requests/:id/status` | Update request status | Admin |
| PUT | `/api/requests/:id` | Update request | Admin |
| DELETE | `/api/requests/:id` | Delete request | Admin |
| GET | `/api/requests/stats` | Get statistics | Admin |

### Admin Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Deactivate user | Admin |
| GET | `/api/admin/requests` | Get all requests | Admin |
| PUT | `/api/admin/requests/:id` | Update request | Admin |
| DELETE | `/api/admin/requests/:id` | Delete request | Admin |

### File Upload

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/upload` | Upload files | Private |
| GET | `/api/upload/:filename` | Get uploaded file | Private |
| DELETE | `/api/upload/:filename` | Delete uploaded file | Private |

## 📝 API Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@bits.edu",
  "password": "password123",
  "bitsId": "2020A7PS0001P"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@bits.edu",
      "role": "student",
      "bitsId": "2020A7PS0001P"
    }
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@bits.edu",
  "password": "admin123"
}
```

### Create Document Request
```bash
POST /api/requests
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "documentType": "Official Transcript",
  "firstName": "John",
  "fatherName": "Smith",
  "email": "john@bits.edu",
  "mobileNumber": "+251911234567",
  "studentStatus": "Graduated",
  "department": "Software Engineering",
  "orderType": "Local",
  "institutionName": "University of Addis"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "trackingNumber": "REQ-ABC123XYZ",
    "status": "Pending",
    "documentType": "Official Transcript",
    "submittedDate": "2024-01-15"
  }
}
```

### Track Request
```bash
GET /api/requests/track/REQ-ABC123XYZ
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "REQ-ABC123XYZ",
    "documentType": "Official Transcript",
    "status": "Processing",
    "submittedDate": "2024-01-15",
    "applicantName": "John Smith"
  }
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Payload
```json
{
  "id": 1,
  "email": "user@bits.edu",
  "role": "student",
  "bitsId": "2020A7PS0001P"
}
```

## 📄 Document Types Supported

1. Official Transcript
2. Original Degree
3. Student Copy
4. Temporary Certificate
5. To Whom It May Concern
6. Document Authentication
7. Document Replacement
8. Supporting Letter

## 🗄️ Database Schema

### Person (Students/Alumni)
- Personal information (name, contact)
- Academic details (department, degree, admission type)
- Graduation information

### DocumentRequest
- Request tracking number
- Document type selection
- Personal & academic information
- Order details (local/international)
- Institution details
- Status tracking (Pending → Approved → Completed)

### AttachedDocument
- Cost sharing letters
- Supporting documents
- File metadata

### Payment
- Receipt generation
- Payment status tracking

### User
- Authentication credentials
- Role-based access (admin/student)
- Account status

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Database Sync (in development)
The database automatically syncs when the server starts. To force sync:
```javascript
// In index.js
await sequelize.sync({ alter: true }); // Updates schema without deleting data
await sequelize.sync({ force: true }); // Drops and recreates tables
```

### Creating Migrations
```bash
# Generate migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate
```

## 🚢 Production Deployment

1. **Set production environment variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=<very_long_random_string>
   DB_HOST=<production_db_host>
   DB_PASSWORD=<strong_password>
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

4. **Use process manager (PM2):**
   ```bash
   pm2 start src/index.js --name alumni-backend
   ```

## 📦 Dependencies

### Core
- `express` - Web framework
- `sequelize` - ORM for MySQL
- `mysql2` - MySQL driver
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

### Middleware
- `cors` - Cross-origin resource sharing
- `multer` - File upload handling
- `dotenv` - Environment variable management

## 🔧 Troubleshooting

### Database Connection Failed
- Check MySQL service is running
- Verify credentials in `.env`
- Ensure database exists

### JWT Token Expired
- Re-login to get new token
- Check `JWT_EXPIRE` setting

### File Upload Issues
- Check `uploads/` directory exists
- Verify file size limits
- Check file type restrictions

### CORS Errors
- Add frontend URL to CORS configuration in `index.js`

## 📄 License

This project is part of the Alumni Management System.

