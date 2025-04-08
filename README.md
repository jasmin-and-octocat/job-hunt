## Overview

Job Hunt is a modern job board platform built with Next.js 15 (frontend) and Strapi headless CMS (backend). The application enables job seekers to search for opportunities and employers to post jobs across various industries.

🔗 **Live Demo**: [https://job-hunt.fly.dev/](https://job-hunt.fly.dev/)

## Architecture

The project is structured as a monorepo with two main parts:

- **Frontend**: Next.js 15 application using the App Router
- **Backend**: Strapi headless CMS with a comprehensive API for job listings and user profiles

## Features

- 🔍 Advanced job search with filters by title, location, and more
- 👤 Job seeker profiles with resume upload, skills, and experience
- 🏢 Company profiles with detailed information
- 📝 Job applications tracking system
- 🔔 Notifications for application updates
- 💼 Multiple job types support (full-time, part-time, contract, etc.)

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) (App Router)
- React 18
- TypeScript
- SWR for data fetching
- UI components with shadcn/ui

### Backend
- [Strapi](https://strapi.io/) (v5.12.3)
- PostgreSQL database
- Strapi Documentation plugin
- Users & Permissions plugin

## Getting Started

### Running the Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables (copy from example)
cp .env.example .env

# Run development server
npm run develop

# Or for production build
npm run build
npm run start
```

### Running the Frontend

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev

# For production build
npm run build
npm run start
```

## API Documentation

The API is fully documented using the Strapi Documentation plugin. After starting the backend server, API documentation is available at:

```
http://localhost:1337/documentation/
```

## Deployment

The project is currently deployed on [Fly.io](https://fly.io/):

- Frontend: Deployed using the Dockerfile in the frontend directory
- Backend: Deployed using the Dockerfile in the backend directory with PostgreSQL

## Project Structure

```
backend/
  - config/        # Strapi configuration
  - src/           # Strapi content types and extensions
  - public/        # Public assets

frontend/
  - src/
    - app/         # Next.js pages and layouts
    - components/  # React components
    - lib/         # Utilities, hooks, and API clients
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)

## Check It Out!

Visit our live demo at [https://job-hunt.fly.dev/](https://job-hunt.fly.dev/) to see the platform in action!

Whether you're looking for your next career opportunity or seeking to hire talented professionals, Job Hunt provides a modern, user-friendly platform for connecting job seekers with employers.
