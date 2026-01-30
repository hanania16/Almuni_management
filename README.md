
# BITS Alumni Management System

A comprehensive web application for BITS alumni to manage document requests, track applications, and stay connected with the alumni community.

## 🚀 Features

### Document Services
- **Official Transcript Request** - Request official academic transcripts
- **Original Degree Request** - Apply for original degree certificates
- **Student Copy Request** - Request student copies of documents
- **Temporary Degree Request** - Apply for temporary degree certificates
- **Supporting Letter Request** - Request supporting letters for various purposes

### User Management
- **Student Registration & Login** - Secure authentication system
- **Admin Dashboard** - Administrative controls and request management
- **Profile Management** - Update personal information and preferences

### Tracking & Communication
- **Real-time Request Tracking** - Track application status with unique tracking numbers
- **Email Notifications** - Stay updated on request progress
- **Document Upload** - Secure file upload for supporting documents

### Community Features
- **Alumni Directory** - Connect with fellow alumni
- **Events Management** - Stay updated on alumni events
- **News & Announcements** - Latest updates from the alumni association

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **Sonner** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=bits_alumni
   JWT_SECRET=your_jwt_secret_key
   UPLOAD_PATH=./uploads
   ```

4. Set up the database:
   ```bash
   npm run setup-db
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📁 Project Structure

```
bits-alumni/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── *.tsx        # Page components
│   │   ├── context/         # React contexts
│   │   └── App.tsx          # Main app component
│   ├── services/
│   │   └── api.js           # API service layer
│   └── styles/              # Global styles
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── index.js         # Server entry point
│   ├── scripts/             # Database setup scripts
│   └── uploads/             # File uploads directory
├── package.json
└── README.md
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup-db` - Initialize database and tables

## 🔐 Authentication

The system supports two types of users:
- **Students**: Can register, login, and submit document requests
- **Admins**: Can manage all requests, users, and system settings

## 📊 Database Schema

### Key Tables
- `users` - User accounts and authentication
- `document_requests` - All document request submissions
- `attached_documents` - File attachments for requests
- `payments` - Payment records for services
- `persons` - Alumni personal information

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
1. Set up a MySQL database on your server
2. Configure environment variables
3. Run database setup: `npm run setup-db`
4. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email alumni@bits.edu.et or join our alumni community forum.

## 🙏 Acknowledgments

- BITS College Administration
- Alumni Association Board
- Open source community for the amazing tools and libraries
  