# DomainPulse

DomainPulse is a full-stack domain appraisal platform that consolidates domain valuation, portfolio tracking, and market analytics into a single interface. It provides side-by-side automated domain valuations by aggregating real-time market data from GoDaddy and Domainify.

## Project Structure

- **`backend/`**: Node.js and Express.js server providing the REST API, in-memory data store, and mock integrations.
- **`frontend/`**: React 18 application scaffolded with Vite, featuring a modern, responsive UI and integrated state management.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

To install all dependencies for both the root, backend, and frontend:

```bash
npm run install:all
```

### Running the Application

You can start both the backend and frontend simultaneously from the root directory using:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

### Component Development

#### Backend

The backend is an Express server running on port 5001.

```bash
cd backend
npm start
```

#### Frontend

The frontend is a Vite project running on port 3000. It is configured to proxy all `/api` requests to the backend server.

```bash
cd frontend
npm run dev
```

## Key Features

- **Authentication**: Secure (mock) Internet Identity connection.
- **Domain Appraisal**: Real-time valuations from GoDaddy and Domainify with historical tracking.
- **Portfolio Management**: Track your domain assets, calculate total value, and monitor performance.
- **Watchlist**: Track domains of interest and receive valuation updates.
- **Market Trends**: Analyze top keywords and sectors with volume and growth metrics.
- **Subscription Plans**: Multi-tier access including Free, Pro, Lifetime, and Enterprise plans with mock checkout.
- **Legal Compliance**: Integrated Terms of Service and Privacy Policy agreement flow with PDF generation.

## Technologies Used

- **Frontend**: React 18, Vite, React Router, Axios, Lucide React, CSS Variables.
- **Backend**: Node.js, Express, PDFKit, UUID, CORS.
- **Monorepo Management**: npm scripts and Concurrently.

## License

This project is proprietary.
