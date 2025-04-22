# Glimpse - Video Meetings Made Simple

![Glimpse Logo](/public/logo_small.png)

## Overview

Glimpse is a modern, feature-rich video conferencing application designed for seamless communication and collaboration. Built with React, TypeScript, and Electron, it offers a responsive and intuitive user experience across desktop and web platforms.

## Features

### Core Features
- **High-Quality Video Conferencing** - Crystal clear video and audio communication
- **Cross-Platform Support** - Works on web, desktop (via Electron), and mobile devices
- **Responsive UI** - Beautiful, adaptive interface built with Tailwind CSS and Framer Motion
- **Dark/Light Mode** - Full theme support for comfortable viewing in any environment

### Meeting Tools
- **Screen Sharing** - Present your screen with a single click
- **In-Meeting Chat** - Text communication alongside video
- **Participant Management** - View and manage meeting participants
- **Meeting Recording** - Save meetings for future reference
- **Background Blur** - Enhance privacy during calls

### Premium Features
- **Extended Meeting Duration** - Longer meeting times beyond the free tier
- **Meeting Transcription** - Automatic speech-to-text conversion
- **Enhanced Security** - Additional encryption and security features
- **Breakout Rooms** - Split meetings into smaller discussion groups
- **Advanced Analytics** - Detailed insights on meeting usage and metrics

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **UI Components**: Shadcn UI
- **State Management**: Jotai
- **Desktop App**: Electron
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod
- **Icon Library**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/glimpse.git
   cd glimpse/client
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Run the Electron app (optional)
   ```bash
   npm run electron
   # or
   yarn electron
   ```

### Building for Production

#### Web App
```bash
npm run build
# or
yarn build
```

#### Desktop App
```bash
npm run package
# or
yarn package
```

This will generate platform-specific builds in the `release-build` directory.

## Project Structure

```
client/
├── public/             # Static assets
├── electron/           # Electron-specific code
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-specific components and logic
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layout components
│   ├── lib/            # Utility functions and helpers
│   ├── pages/          # Page components
│   ├── services/       # API and external service integrations
│   ├── stores/         # State management with Jotai
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
└── tests/              # Test files
```

## Developer Guide

### Environment Setup

1. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`
   - Fill in the required credentials for API keys and service endpoints

2. Configure development tools:
   - Install the recommended VS Code extensions (see `.vscode/extensions.json`)
   - Set up ESLint and Prettier with `npm run setup-dev-tools`

### Code Conventions

- **Component Structure**: Use functional components with TypeScript interfaces for props
- **Naming**: PascalCase for components, camelCase for variables and functions
- **State Management**: Use Jotai atoms for global state, React hooks for local state
- **Styling**: Use Tailwind utility classes and CSS modules for component-specific styling
- **Testing**: Write tests for critical functionality using Vitest and React Testing Library

### Working with the Codebase

- **Component Development**: Add new components in appropriate directories under `src/components`
- **Feature Development**: Isolate feature-specific code in `src/features`
- **API Integration**: Create service modules in `src/services` for external API calls
- **Routing**: Define new routes in `src/App.tsx` using React Router

### Useful Commands

```bash
# Run tests
npm run test

# Run type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Check for build issues
npm run build:check
```

### Troubleshooting

#### Common Issues:

1. **WebRTC Connection Problems**:
   - Check browser permissions for camera and microphone
   - Ensure proper TURN/STUN server configuration in `src/services/rtc-config.ts`

2. **Electron Build Failures**:
   - Run `npm rebuild` to rebuild native dependencies
   - Check Electron version compatibility with Node.js version

3. **State Management Issues**:
   - Use the Redux DevTools to inspect Jotai state
   - Check for component re-renders with React DevTools profiler

### Getting Help

- Check existing issues on the GitHub repository
- Join our developer Discord channel for real-time help
- Consult the Wiki for in-depth documentation on specific features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please follow our [Contribution Guidelines](CONTRIBUTING.md) for detailed instructions.
