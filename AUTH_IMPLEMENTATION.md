# Smart Resume Analyzer with Authentication

This project now includes a complete user authentication system with MongoDB and JWT tokens.

## Features Implemented

### Authentication System
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ MongoDB database with Mongoose
- ✅ Password hashing with bcrypt
- ✅ Form validation

### Pages Created
1. **Landing Page** (`/`) - Shows features and signup/login options for non-authenticated users
2. **Login Page** (`/login`) - Email/password login form
3. **Signup Page** (`/signup`) - User registration form with validation
4. **Dashboard Page** (`/dashboard`) - Protected dashboard with sidebar navigation
5. **Resume Analyser Page** (`/resume-analyser`) - Protected page with resume analysis functionality

### Authentication Flow
1. Users can register with name, email, and password
2. Passwords are hashed before storing in MongoDB
3. Login generates a JWT token stored in cookies
4. Protected routes verify JWT tokens
5. Users can logout to clear session
6. Automatic redirect to dashboard for authenticated users

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed)
net start MongoDB

# Or using Docker
docker run -d -p 27017:27017 mongo:latest
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3001`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/fyp_auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
GOOGLE_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=openai
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout (protected)

### Resume Analysis Routes
- `POST /api/analyze-resume` - Analyze resume (protected)
- `GET /api/ai-providers` - Get available AI providers (protected)

## Testing the Authentication

1. **Visit the landing page**: `http://localhost:3001`
2. **Create an account**: Click "Create Account" and register
3. **Login**: Use your credentials to login
4. **Access dashboard**: You'll be redirected to the dashboard
5. **Resume analysis**: Click "Resume Analyser" in the sidebar
6. **Logout**: Use the logout button in the dashboard

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features
- Passwords are hashed using bcrypt
- JWT tokens with 7-day expiration
- Protected routes with middleware
- Input validation and sanitization
- Secure HTTP-only cookies for token storage
- CORS configuration for API security

## Next Steps
1. Add password reset functionality
2. Add email verification
3. Add user profile management
4. Add resume analysis history
5. Add admin panel for user management
