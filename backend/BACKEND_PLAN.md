# Backend Development Plan for Alumni Management System

## Objective
Build a fully functional backend API that is compatible with the existing frontend, replacing localStorage-based storage with MySQL database.

---

## Phase 1: Database Setup & Configuration

### 1.1 Database Configuration
- **File**: `backend/config/database.js`
- Create MySQL connection using Sequelize
- Configure connection pool for production
- Handle connection errors and retries

### 1.2 Models (Sequelize)
Create the following models in `backend/src/models/`:

#### a) Person.js
- Maps to `Person` table in database.md
- Includes: firstName, fatherName, grandfatherName, idNo, mobileNumber, email, studentStatus, departmentName, admissionTypeName, degreeTypeName, graduationYear, graduationCalendar
- Add hooks for password hashing (for students)

#### b) DocumentRequest.js
- Maps to `DocumentRequest` table
- Includes: requestDate, orderType, institutionName, country, institutionAddress, mailingAgent, requestStatus, documentType
- Foreign key to Person

#### c) AttachedDocument.js
- Maps to `AttachedDocument` table
- Includes: fileName, fileType, description
- Foreign key to DocumentRequest

#### d) Payment.js
- Maps to `Payment` table
- Includes: receiptNumber, paymentDate, amount, paymentStatus
- Foreign key to DocumentRequest

#### e) User.js (for Authentication)
- email, password, role (admin/student), bitsId, isActive, lastLogin
- Student accounts link to Person records via email

---

## Phase 2: Authentication System

### 2.1 Auth Controller
**File**: `backend/src/controllers/authController.js`

#### Register Student
- Endpoint: `POST /api/auth/register`
- Input: name, email, password, bitsId
- Validation: Check if email/bitsId already exists
- Create User record and link to Person
- Return JWT token

#### Login
- Endpoint: `POST /api/auth/login`
- Input: email, password
- For admin: Check hardcoded credentials or admin table
- For students: Verify against User table
- Return JWT token + user info

#### Logout
- Endpoint: `POST /api/auth/logout`
- Client-side token removal

#### Get Current User
- Endpoint: `GET /api/auth/me`
- Verify JWT, return user profile

---

## Phase 3: Document Request API

### 3.1 Request Controller
**File**: `backend/src/controllers/requestController.js`

#### Create Request
- Endpoint: `POST /api/requests`
- Input: All document-specific fields (varies by document type)
- Handle file uploads (attached documents)
- Generate tracking number automatically
- Create DocumentRequest record

#### Get All Requests (Admin)
- Endpoint: `GET /api/requests`
- Auth: Admin only
- Support filtering by status, type, date range
- Pagination support

#### Get My Requests (Student)
- Endpoint: `GET /api/requests/my`
- Auth: Student
- Return only current student's requests

#### Get Request by ID
- Endpoint: `GET /api/requests/:id`
- Auth: Admin or owner student
- Return full request details with attachments

#### Update Request Status
- Endpoint: `PUT /api/requests/:id/status`
- Auth: Admin only
- Input: status (Pending/Approved/Processing/Rejected/Completed)
- Update DocumentRequest status

#### Track Request (Public)
- Endpoint: `GET /api/requests/track/:trackingNumber`
- Public endpoint
- Return basic request status info

---

## Phase 4: Admin Management

### 4.1 Admin Controller
**File**: `backend/src/controllers/adminController.js`

#### Dashboard Statistics
- Endpoint: `GET /api/admin/stats`
- Return counts: total, pending, processing, completed, rejected requests

#### Manage Users
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user status
- `DELETE /api/admin/users/:id` - Deactivate user

#### Manage Requests (Extended)
- `GET /api/admin/requests` - All requests with filters
- `PUT /api/admin/requests/:id` - Full request update
- `DELETE /api/admin/requests/:id` - Delete request

---

## Phase 5: File Upload Handling

### 5.1 Upload Controller
**File**: `backend/src/controllers/uploadController.js`

- Endpoint: `POST /api/upload`
- Handle multipart/form-data
- Store files in `backend/uploads/` directory
- Return file paths/URLs
- File type validation (PDF, images)
- Size limit enforcement (e.g., 10MB max)

---

## Phase 6: API Routes Setup

### 6.1 Route Files
Create in `backend/src/routes/`:

- `authRoutes.js` - Auth endpoints
- `requestRoutes.js` - Document request endpoints
- `adminRoutes.js` - Admin endpoints
- `uploadRoutes.js` - File upload endpoints

### 6.2 Middleware
- `authMiddleware.js` - JWT verification
- `adminMiddleware.js` - Admin role check
- `uploadMiddleware.js` - File upload handling
- `errorMiddleware.js` - Centralized error handling

---

## Phase 7: Main Server File

### 7.1 Entry Point
**File**: `backend/src/index.js`

- Initialize Express app
- Connect to MySQL database
- Setup middleware (CORS, JSON parsing, file uploads)
- Mount routes
- Error handling
- Start server

---

## Phase 8: Environment Configuration

### 8.1 Environment Variables
**File**: `backend/.env`

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=alumni_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

---

## Phase 9: Database Setup Script

### 9.1 Setup Script
**File**: `backend/scripts/setup-database.js`

- Create database if not exists
- Run migrations/create tables
- Seed initial admin user
- Seed sample data for testing

---

## Phase 10: Frontend Integration

### 10.1 API Service
**File**: `frontend/src/services/api.js`

- Replace localStorage calls with API calls
- Handle JWT token storage
- Error handling and toast notifications

### 10.2 Auth Context Update
**File**: `frontend/src/context/AuthContext.tsx`

- Replace localStorage auth with API calls
- Login: Call `POST /api/auth/login`
- Register: Call `POST /api/auth/register`
- Logout: Call `POST /api/auth/logout`

### 10.3 Dashboard Updates
- StudentDashboard: Call `GET /api/requests/my`
- AdminDashboard: Call `GET /api/admin/requests` and `GET /api/admin/stats`

---

## Implementation Order

1. **Setup & Configuration**
   - database.js (MySQL connection)
   - .env file

2. **Models**
   - Person.js
   - DocumentRequest.js
   - AttachedDocument.js
   - Payment.js
   - User.js

3. **Middleware**
   - authMiddleware.js
   - adminMiddleware.js

4. **Controllers**
   - authController.js
   - requestController.js
   - adminController.js
   - uploadController.js

5. **Routes**
   - authRoutes.js
   - requestRoutes.js
   - adminRoutes.js
   - uploadRoutes.js

6. **Server**
   - index.js

7. **Setup Script**
   - setup-database.js

8. **Frontend Integration**
   - api.js service
   - AuthContext updates

---

## Key Considerations

1. **Backward Compatibility**: Keep the localStorage fallback in frontend until backend is fully tested
2. **Error Handling**: Comprehensive error handling with proper HTTP status codes
3. **Validation**: Input validation for all endpoints
4. **Security**: Password hashing, JWT tokens, rate limiting
5. **File Storage**: Secure file upload handling
6. **Pagination**: For admin request list
7. **Search/Filter**: For admin dashboard

---

## Testing Plan

1. **Unit Tests**: Test models, controllers, and middleware
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test full user flows (register → login → request → admin approve)
4. **Load Testing**: Ensure server handles concurrent requests

---

## Success Criteria

✅ Backend server runs without errors
✅ All API endpoints return correct responses
✅ Database tables created with proper relationships
✅ JWT authentication works correctly
✅ File uploads work
✅ Frontend localStorage can be fully replaced with API calls
✅ Admin dashboard functions with real data
✅ Student dashboard functions with real data
✅ Document request submission works end-to-end

