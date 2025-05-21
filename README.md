# Web3 Wallet Platform

A secure and user-friendly Web3 wallet platform that enables users to manage and transfer NFTs on the Polygon network with username-based transfers.

## Features

- 🔐 Wallet-based authentication (Through MetaMask)
- 💎 View NFT & token balances
- 🔄 Transfer ERC-721 and ERC-1155 NFTs using usernames
- 👤 User profile management
- ⚡ High-performance & real-time updates
- 📱 Basic Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v22.14.0 or higher)
- npm (v11.1.0 or higher)
- Docker & Docker Compose
- MetaMask browser extension
- Git

## Database

If you prefer to use the `./dbschema/index.sql` in your Supabase custom project feel free, although I've pushed the credentials in the .env.example as this is a dummy account for the project. Note in real world scenario, I would never push these credentials in git,svn or any other source control

### In case you prefer to use the SQL schema provided

1. Go to Supabase
2. Login
3. Create Project
4. Go to SQL Editor
5. Copy contents from `./dbschema/index.sql` SQL Schema
6. Run and it

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/red-game-dev/TheMarketplace web3-wallet-platform
cd web3-wallet-platform
```

2. Create environment files (cp .env.example):

For backend (backend/.env):
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_SCAN_API_KEY=your_polygonscan_api_key
PRIVATE_KEY=your_private_key
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
REDIS_PUBLIC_URL=
```

For frontend (frontend/.env.local) (cp .env.example)::
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Installation

Install all dependencies for the project:

```bash
# Install root project dependencies and all sub-project dependencies
npm run install:all
```

## Available Commands

### Root Project Commands

```bash
# Start all services (frontend, backend, and Docker containers)
npm run start

# Start individual services
npm run start:frontend    # Start frontend dev server
npm run start:backend     # Start backend dev server
npm run docker:up         # Start Docker containers

# Build the project
npm run build            # Build both frontend and backend
npm run build:frontend   # Build only frontend
npm run build:backend    # Build only backend

# Run tests
npm run test             # Run all tests
npm run test:frontend    # Run frontend tests
npm run test:backend     # Run backend tests

# Linting
npm run lint             # Run linting on all projects
npm run lint:frontend    # Run frontend linting
npm run lint:backend     # Run backend linting

# Formatting
npm run format           # Format all code
npm run format:frontend  # Format frontend code
npm run format:backend   # Format backend code
```

### Frontend-specific Commands (in frontend directory)

```bash
npm run dev         # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linting
```

### Backend-specific Commands (in backend directory)

```bash
npm run start:dev   # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run test       # Run tests
npm run lint       # Run linting
```


# Web3 Wallet Platform Setup Guide

This guide provides a step-by-step process to set up and run the Web3 Wallet Platform, which allows users to view their NFTs and send them to other users by username.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v8 or higher) or yarn
- Docker and Docker Compose
- MetaMask browser extension
- Git

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TheMarketplace.git
cd TheMarketplace
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Set Up Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one.
2. Create a new project.
3. Navigate to the SQL Editor in your Supabase dashboard.
4. Copy and paste the SQL commands from `dbschema/index.sql` into the SQL editor and run them to create the necessary tables and indexes.
5. Go to Project Settings > API to get your Supabase URL and anon/service keys.

### 4. Set Up Environment Variables

#### Backend (.env file in backend folder)

Create a `.env` file in the `backend` directory with the following variables:

```
# Server
PORT=4000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT
JWT_SECRET=your_jwt_secret_key

# Polygon Network
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_SCAN_API_KEY=your_polygonscan_api_key

# Redis
REDIS_PUBLIC_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_POINTS=60
RATE_LIMIT_DURATION=60
```

#### Frontend (.env.local file in frontend folder)

Create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Start Redis with Docker

Start the Redis container for caching and rate limiting:

```bash
docker-compose up -d
```

### 6. Run the Application

Start both the backend and frontend applications:

```bash
# In one terminal, start the backend
cd backend
npm run start:dev

# In another terminal, start the frontend
cd frontend
npm run dev
```

## Using the Web3 Wallet Platform

### 1. Connect Your Wallet

1. Navigate to http://localhost:3000
2. Click on "Connect Wallet" in the navigation bar
3. Select MetaMask when prompted
4. Approve the connection in the MetaMask popup

### 2. Create a Username

1. Go to the Profile page
2. Fill in your desired username, display name, and bio
3. Click "Save Changes"

### 3. View Your NFTs

1. Navigate to the "My NFTs" page
2. Your NFTs on the Polygon network will be displayed
3. If you don't have any NFTs, you'll see a message indicating this

### 4. Transfer an NFT

1. On the "My NFTs" page, find the NFT you want to transfer
2. Click the "Transfer" button on the NFT card
3. Enter the recipient's username in the transfer dialog
4. Click "Transfer NFT"
5. Approve the transaction in MetaMask
6. Wait for the transaction to be confirmed on the blockchain

### 5. View Transaction History

1. Go to the Profile page
2. Scroll down to see your transaction history
3. Each transaction shows details like status, recipient, and timestamp

## Troubleshooting

### MetaMask Connection Issues

- Ensure you're on the Polygon network in MetaMask
- Try refreshing the page and reconnecting
- Check if your MetaMask is locked and unlock it

### Transaction Failures

- Ensure you have enough MATIC for gas fees
- Check if the NFT is still in your wallet
- Verify that the NFT contract supports the transfer method you're using

### Rate Limiting

The API implements rate limiting to prevent abuse. If you receive a "Too Many Requests" error:
- Wait for a minute before trying again
- Reduce the frequency of your requests

## Architecture

```
project-root/
├── architecture/       # The architecture of the project
├── performance/       # The performance simulated for performance trace and lighthouse
├── frontend/           # Next.js frontend application
├── backend/           # NestJS backend application
├── dbschema/          # Database schema and migrations
└── docker-compose.yml # Docker configuration
```

## Development Workflow

1. Start the development environment:
```bash
npm run start
```

2. Access the applications:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

## Deployment

The project is configured for deployment on:
- Frontend: Vercel
- Backend & Redis: Railway
- Database: Supabase

Follow platform-specific deployment guides for detailed instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.