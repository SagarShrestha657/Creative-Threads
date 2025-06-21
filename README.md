# Creative-Threads

A full-stack social media platform designed specifically for artists to share, discover, and connect through their creative work. Built with React, Node.js, and MongoDB.

## 🎨 Features

### Core Features
- **User Authentication & Authorization** - Secure login/signup with JWT tokens
- **Art Posting** - Upload and share artwork with titles and descriptions
- **Social Interactions** - Like, comment, and reply on posts
- **Real-time Messaging** - Live chat functionality with Socket.io
- **User Profiles** - Customizable artist profiles with portfolio showcase
- **Explore Feed** - Discover new artists and artwork
- **Search Functionality** - Find users and posts
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### Technical Features
- **Image Processing** - High-quality image optimization with Sharp
- **Cloud Storage** - Cloudinary integration for image hosting
- **Real-time Updates** - WebSocket connections for live features
- **Email Verification** - Secure account verification system
- **Password Reset** - Forgot password functionality

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Swiper** - Touch slider component
- **DaisyUI** - Component library for Tailwind

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Sharp** - High-quality image processing
- **Cloudinary** - Cloud image management
- **Nodemailer** - Email sending
- **CORS** - Cross-origin resource sharing
- **Google Cloud Vision** - Image analysis

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Mongo Express** - MongoDB admin interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (or use Docker)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Creative-Threads
   ```

2. **Backend Environment Variables**
   Create a `.env` file in the `Backend/` directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/creative-threads
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   HF_API_TOKEN=your_huggingface_token
   ```

3. **Frontend Environment Variables**
   Create a `.env` file in the `Frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_SOCKET_URL=http://localhost:5001
   ```

### Running with Docker (Recommended)

1. **Start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - MongoDB Express: http://localhost:8081

### Running Locally

1. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Start MongoDB** (if not using Docker)
   ```bash
   mongod
   ```

## 📁 Project Structure

```
Creative-Threads/
├── Backend/
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── exploreController.js
│   │   │   ├── messageController.js
│   │   │   ├── postsController.js
│   │   │   └── updateController.js
│   │   ├── lib/           # Utilities and configurations
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── email.js
│   │   │   ├── socket.js
│   │   │   └── utils.js
│   │   ├── middleware/    # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── multerMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── TrackUserMiddleware.js
│   │   ├── models/        # MongoDB schemas
│   │   │   ├── messageModel.js
│   │   │   ├── postModel.js
│   │   │   └── userModel.js
│   │   └── routes/        # API routes
│   │       ├── authRoutes.js
│   │       ├── exploreRoutes.js
│   │       ├── messageRoutes.js
│   │       ├── postsRoutes.js
│   │       └── updateRoutes.js
│   ├── index.js           # Server entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ChatComponents/
│   │   │   ├── skeletons/
│   │   │   └── ui/
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   ├── App.jsx            # Main app component
│   └── package.json
└── docker-compose.yml     # Docker orchestration
```


## 🎯 Key Features Explained

### Real-time Messaging
The application uses Socket.io for real-time messaging, allowing users to chat instantly without page refreshes. Messages are stored in MongoDB and delivered in real-time.

### High-Quality Image Processing
Images are processed using Sharp with high JPEG quality (90) before being uploaded to Cloudinary, ensuring excellent image quality while maintaining reasonable file sizes.

### Authentication Flow
- JWT-based authentication with secure token storage
- Email verification for new accounts
- Password reset functionality with email
- Session management with HTTP-only cookies

### Social Features
- Follow/unfollow system for user connections
- Like and comment on posts with real-time updates
- Reply system for comments
- User discovery through explore feed
- Search functionality for users and posts

### User Profiles
- Customizable artist profiles
- Portfolio showcase with posts
- Profile picture management
- User statistics and following/follower counts

## 🚀 Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the Backend directory
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables for production API URLs
3. Deploy the Frontend directory
4. Set build command: `npm run build`
5. Set output directory: `dist`

## 🐳 Docker Configuration

The project includes Docker configuration for easy development and deployment:

- **Frontend Container**: React app with Vite
- **Backend Container**: Node.js Express server
- **MongoDB Container**: Database with persistent storage
- **Mongo Express Container**: Database admin interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- React  for the amazing framework
- Tailwind CSS for the utility-first approach
- Socket.io for real-time capabilities
- Cloudinary for image management
- MongoDB for the flexible database solution
- Sharp for high-quality image processing

---

**Creative-Threads** - Where artists connect and create together! 🎨✨
