# Chatbot Application

A modern chatbot application built with Next.js, TypeScript, and Prisma, featuring both a user-facing chat interface and an administrative panel for user analytics.

## Overview

This project consists of two main components:
- A chatbot interface for user interactions
- An admin panel (accessible at `/admin`) for viewing collected user information

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

Clone the repository and install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=<your-mongodb-url>
GROQ_API_KEY=<Groq-API-Key>
```

### Development Server

To start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
