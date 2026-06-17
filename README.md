# Spring PetClinic — React Frontend

React 18 + TypeScript frontend for the [Spring PetClinic REST API](https://github.com/spring-petclinic/spring-petclinic-rest).

## Tech Stack

- **React 18** with TypeScript
- **Vite** — build tool
- **React Router v6** — client-side routing
- **React Query** (@tanstack/react-query) — data fetching & caching
- **react-hook-form** — form handling & validation
- **Axios** — HTTP client
- **Bootstrap 3** — styling

## Prerequisites

- Node.js 18+ (or 20+)
- Backend API running at `http://localhost:9966/petclinic/api/`

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (default port 4200)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_REST_API_URL` | `http://localhost:9966/petclinic/api/` | Backend REST API base URL |

Configure in `.env` file at the project root.

## Docker

```bash
docker build -t petclinic-frontend .
docker run -p 8080:8080 petclinic-frontend
```

## Project Structure

```
src/
├── api/          # Axios API client & entity API functions
├── components/   # Shared components (Navbar, Layout)
├── hooks/        # React Query custom hooks
├── models/       # TypeScript interfaces
├── pages/        # Page components organized by feature
│   ├── owners/
│   ├── pets/
│   ├── visits/
│   ├── vets/
│   ├── pettypes/
│   └── specialties/
├── App.tsx        # Router configuration
├── main.tsx       # Entry point
└── index.css      # Global styles
```

## Running Tests

```bash
npm test
```
