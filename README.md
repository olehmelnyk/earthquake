# Earthquake Tracker

A monorepo application for tracking earthquake data built with NX, Next.js, Express, GraphQL, and Prisma.

## Tech Stack

- Frontend: Next.js with Apollo Client, TailwindCSS, and ShadCN/UI
- Backend: Express with Apollo Server GraphQL API
- Database: PostgreSQL with Prisma ORM
- Testing: Vitest for unit tests, Playwright for e2e tests
- Monorepo: NX for workspace management

## Prerequisites

- Node.js (v18+)
- PNPM package manager
- Docker and Docker Compose (for PostgreSQL)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the PostgreSQL database:

```bash
docker-compose up -d
```

4. Generate Prisma client:

```bash
pnpm db:generate
```

5. Run database migrations:

```bash
pnpm db:migrate
```

6. Seed the database with earthquake data:

```bash
# Download the earthquake CSV file first
curl -o earthquakes.csv https://data.humdata.org/dataset/catalog-of-earthquakes1970-2014/resource/10ac8776-5141-494b-b3cd-bf7764b2f964/download/earthquakes.csv

# Then import it
pnpm db:seed earthquakes.csv
```

7. Start the development servers:

```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3333/graphql

## Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm dev:web` - Start only the web frontend
- `pnpm dev:api` - Start only the API backend
- `pnpm build` - Build all applications
- `pnpm test` - Run all tests
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Launch Prisma Studio UI
- `pnpm db:seed` - Import earthquake data from CSV file

## Project Structure

- `/apps/web` - Next.js frontend application
- `/apps/api` - Express GraphQL API backend
- `/packages/db` - Prisma database models and client
- `/packages/graphql` - Shared GraphQL schema and resolvers
- `/packages/ui` - Shared UI components library with Storybook
- `/packages/types` - Shared TypeScript types and Zod validators

## GraphQL API

The GraphQL API provides the following operations:

### Queries
- `earthquakes`: Get a list of all earthquakes
- `earthquake(id: ID!)`: Get a specific earthquake by ID

### Mutations
- `createEarthquake(location: String!, magnitude: Float!, date: String!)`: Create a new earthquake
- `updateEarthquake(id: ID!, location: String, magnitude: Float, date: String)`: Update an existing earthquake
- `deleteEarthquake(id: ID!)`: Delete an earthquake by ID

## Database Schema

The Earthquake model follows the requirements with the following fields:
- `id` (String): A unique identifier for each earthquake
- `location` (String): The location where the earthquake occurred
- `magnitude` (Float): The magnitude of the earthquake
- `date` (DateTime): The date when the earthquake occurred
- `createdAt` (DateTime): Timestamp for record creation
- `updatedAt` (DateTime): Timestamp for last update

## Development Workflow

1. Make changes to your code
2. Run tests: `pnpm test`
3. Build the application: `pnpm build`

## License

Private - Not for distribution