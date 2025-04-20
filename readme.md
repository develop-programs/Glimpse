# Glimpse - Video Meetings Made Simple

![Glimpse](./client/public/glimpse.webp)

Glimpse is a modern video conferencing platform designed to make virtual meetings seamless, secure, and feature-rich. Whether for team collaboration, client presentations, or virtual events, Glimpse provides a comprehensive set of tools to enhance your online communication experience.

## 📋 Project Overview

This project consists of two main components:

- **Client**: Frontend React application built with Vite, TypeScript, and Tailwind CSS
- **Server**: Backend Express.js application with MongoDB database

## ✨ Key Features

- **Video Conferencing**: High-quality video meetings with multiple participants
- **Real-time Chat**: In-meeting messaging for enhanced collaboration
- **Screen Sharing**: Share your screen during meetings for better presentations
- **Meeting Recording**: Record sessions for future reference
- **Breakout Rooms**: Split meetings into smaller groups for focused discussions
- **AI Assistant**: Built-in AI chat for quick help during meetings
- **Cross-Platform Support**: Works on mobile, tablet, and desktop devices
- **End-to-End Encryption**: Secure communication for all meetings
- **Premium Features**: Advanced options available for premium users

## 🛠️ Tech Stack

### Frontend (Client)
- React with TypeScript
- Vite for fast development
- Framer Motion for animations
- Tailwind CSS for styling
- Radix UI components
- Jotai for state management
- Electron for desktop application

### Backend (Server)
- Express.js
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. For building the production version:
```bash
npm run build
```

5. For running the Electron desktop app:
```bash
npm run electron
```

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```bash
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
SOCKET_PORT=<socket-port>
```

4. Start the server:
```bash
npm start
```

## 🗂️ Project Structure

```
glimpse/
├── client/                   # Frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, icons, and other assets
│   │   ├── components/       # React components
│   │   │   ├── common/       # Shared/reusable components
│   │   │   ├── layout/       # Layout components (sidebar, header)
│   │   │   ├── meeting/      # Meeting-related components
│   │   │   └── ui/           # Basic UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API and external service integrations
│   │   ├── store/            # State management (Jotai)
│   │   ├── styles/           # Global styles and Tailwind configuration
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Entry point
│   └── electron/             # Electron-specific code for desktop app
│
├── server/                   # Backend application
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middlewares
│   ├── models/               # Mongoose database models
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic
│   ├── socket/               # Socket.IO event handlers
│   ├── utils/                # Utility functions
│   └── index.js              # Entry point
```

## 🏛️ Architecture Overview

### Client Architecture

The frontend uses a component-based architecture with React and follows these design principles:

1. **Component-based structure**: UI elements are broken down into reusable components
2. **State management**: Uses Jotai for global state management with atoms
3. **API integration**: Custom hooks abstracts data fetching logic
4. **Responsive design**: Tailwind CSS for adaptive layouts across devices

### Server Architecture

The backend follows an MVC-inspired architecture:

1. **Routes**: Define API endpoints and connect them to controllers
2. **Controllers**: Handle request/response cycle and invoke services
3. **Services**: Contain core business logic
4. **Models**: Define data structure and database interactions
5. **Socket handlers**: Manage real-time communication events

### Data Flow

1. User interactions in the frontend trigger state changes or API calls
2. API requests are sent to the backend endpoints
3. Controllers validate inputs and route to appropriate services
4. Services perform business logic and database operations
5. Results are returned to the frontend
6. For real-time features, Socket.IO establishes bidirectional communication

## 🧭 Navigation Guide

### Core Workflows

1. **Authentication Flow**
   - User authentication is handled through JWT tokens
   - Login/signup pages are in `client/src/pages/auth/`
   - Authentication state is managed in `client/src/store/authStore.ts`
   - Backend auth routes and controllers are in `server/routes/auth.js` and `server/controllers/authController.js`

2. **Meeting Creation and Joining**
   - Meeting creation UI is in `client/src/components/meeting/CreateMeeting.tsx`
   - Join meeting flow is in `client/src/pages/JoinMeeting.tsx`
   - Backend meeting management is in `server/controllers/meetingController.js`

3. **Video Conferencing**
   - WebRTC connection logic is in `client/src/services/webRTC.ts`
   - Video/audio stream management is in `client/src/hooks/useMediaStream.ts`
   - UI components are in `client/src/components/meeting/`
   - Socket.IO signaling is handled in `server/socket/meetingHandler.js`

4. **Chat Functionality**
   - Chat UI components are in `client/src/components/chat/`
   - Message state management is in `client/src/store/chatStore.ts`
   - Socket.IO events for chat are in `server/socket/chatHandler.js`

### Development Workflows

1. **Adding a New Feature**
   - For UI features: Add components in appropriate folders under `client/src/components/`
   - For API endpoints: Add routes in `server/routes/` and controllers in `server/controllers/`
   - For real-time features: Update socket handlers in both client and server

2. **Making API Calls**
   - Use the API service in `client/src/services/api.ts`
   - Create custom hooks in `client/src/hooks/` for complex data fetching

3. **State Management**
   - Use component state for local UI state
   - Use Jotai atoms in `client/src/store/` for global state
   - Create selectors for derived state

4. **Testing**
   - Component tests are in `__tests__` directories next to the components
   - API tests use Jest and are in `server/__tests__/`

## 👨‍💻 Development Best Practices

1. **Code Style**
   - Follow the established project patterns
   - Use TypeScript types for all components and functions
   - Document complex logic with comments

2. **Commits and Branching**
   - Use feature branches for new features
   - Write descriptive commit messages
   - Reference issue numbers in commits when applicable

3. **Performance Considerations**
   - Memoize expensive calculations with `useMemo`
   - Use `useCallback` for functions passed to child components
   - Lazy-load components that aren't needed on initial render

4. **Troubleshooting Common Issues**
   - WebRTC connection issues: Check STUN/TURN server configuration
   - Authentication problems: Verify JWT token expiration and validity
   - Socket connection issues: Ensure proper Socket.IO event registration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
