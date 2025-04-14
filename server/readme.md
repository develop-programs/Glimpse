# Glimpse Server

Backend server for the Glimpse video conferencing application.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/glimpse
```

### Development

To run the server in development mode with hot reloading:

```
npm run dev
```

### Production

To start the server in production:

```
npm start
```

## API Routes

### Health Check
- `GET /api/health` - Check API status

### Rooms
- `GET /api/rooms/:roomId` - Get room information
- `POST /api/rooms` - Create a new room

### Meetings
- `GET /api/meetings` - Get user's meetings
- `POST /api/meetings` - Schedule a new meeting

## Technologies

- Express.js
- MongoDB with Mongoose
- CORS for cross-origin resource sharing
- dotenv for environment variables
