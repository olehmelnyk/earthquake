# Earthquake Tracker

A monorepo application for tracking earthquake data built with NX, Next.js, Express, GraphQL, and Prisma.

> For a comprehensive overview of the project architecture and implementation details,
> please refer to the [Project Overview Document](docs/project-overview.md).

## Tech Stack

- Frontend: Next.js with Apollo Client, TailwindCSS, and ShadCN/UI
- Backend: Express with Apollo Server GraphQL API
- Database: PostgreSQL with Prisma ORM
- Testing: Vitest for unit tests, Playwright for e2e tests
- Monorepo: NX for workspace management

## Prerequisites

- Node.js (v22+)
- PNPM package manager
- Docker and Docker Compose (for PostgreSQL)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install

# not sure why it's not installing automatically - try this, but may still need to manually install those packages deps
pnpm install --filter @earthquake/types --filter @earthquake/graphql --filter @earthquake/web --filter @earthquake/db
```

3. Set up environment variables:

```bash
# For the API
cp apps/api/.env.example apps/api/.env # if .env.local does not exists

# For the web app (if not already existing)
cp apps/web/.env.example apps/web/.env # if .env.local does not exists
```

Make sure to update the environment variables with your specific configuration if needed.

4. Start the PostgreSQL database:

```bash
docker-compose up -d
```

5. Generate Prisma client:

```bash
pnpm db:generate
```

6. Run database migrations:

```bash
pnpm db:migrate
```

7. Seed the database with earthquake data:

```bash
# Download the earthquake CSV file
./scripts/download-earthquake-data.sh

# Then seed the database
pnpm db:seed
```

The seed script imports earthquake data from the CSV file located at `packages/db/data/earthquakes.csv`.

8. Start the development servers:

```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:4200
- Backend API: http://localhost:4224/graphql

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

## UI Components

We use ShadCN UI components for the frontend, implemented using atomic design principles. Components are organized in the `packages/ui` library:

### Component Categories
- **Atoms**: Basic building blocks (Button, Input, Label, Select, Slider)
- **Molecules**: More complex components (AlertDialog, Dialog, Form, Toast)
- **Organisms**: Complex UI sections (DataTable, layouts)

### Using UI Components

```tsx
// Import components from the UI package
import { Button, Input, DataTable } from '@earthquake/ui';

// Use them in your components
function MyComponent() {
  return (
    <div>
      <Input placeholder="Search..." />
      <Button>Submit</Button>
    </div>
  );
}
```

### UI Features
- **Layout**: Sidebar with filters + main content with data table
- **Data Display**: Sortable and paginated data table
- **Actions**: Add, edit, and delete earthquakes with form dialogs
- **Notifications**: Toast messages for feedback
- **Filtering**: Filter by location, magnitude range, and date range

## GraphQL API

The GraphQL API provides the following queries and mutations:

### Queries
- `earthquakes(page: Int, limit: Int, filter: EarthquakeFilter, sort: EarthquakeSort)`: Get earthquakes with pagination, filtering, and sorting
  - Default pagination: 10 items per page, maximum 100 items per page
  - Filtering options: date range, magnitude range, and location search
  - Sorting options: any field with ascending or descending direction
  - Returns a `PaginatedEarthquakes` object with `data`, `count`, and `hasMore` fields
- `earthquake(id: ID!)`: Get a specific earthquake by ID

### Mutations
- `addEarthquake(location: String!, magnitude: Float!, date: String!)`: Add a new earthquake
- `updateEarthquake(id: ID!, location: String, magnitude: Float, date: String)`: Update an existing earthquake
- `deleteEarthquake(id: ID!)`: Delete an earthquake by ID

### Example Queries

#### Get paginated earthquakes
```graphql
query {
  earthquakes(page: 1, limit: 10) {
    data {
      id
      location
      magnitude
      date
    }
    count
    hasMore
  }
}
```

#### Filter earthquakes
```graphql
query {
  earthquakes(
    filter: {
      dateFrom: "2022-01-01",
      dateTo: "2022-12-31",
      magnitudeFrom: 5.0,
      magnitudeTo: 7.0,
      location: "California"
    }
  ) {
    data {
      id
      location
      magnitude
      date
    }
    count
    hasMore
  }
}
```

#### Sort earthquakes
```graphql
query {
  earthquakes(
    sort: {
      field: "magnitude",
      direction: desc
    }
  ) {
    data {
      id
      location
      magnitude
      date
    }
    count
    hasMore
  }
}
```

## Database

This project uses PostgreSQL as the database. The database is set up with Docker Compose.

### Database Schema

The Earthquake model follows the requirements with the following fields:
- `id` (String): A unique identifier for each earthquake
- `location` (String): The location where the earthquake occurred
- `magnitude` (Float): The magnitude of the earthquake
- `date` (DateTime): The date when the earthquake occurred
- `createdAt` (DateTime): Timestamp for record creation
- `updatedAt` (DateTime): Timestamp for last update

### Setup

Run the following command to start the database:

```bash
docker-compose up -d postgres
```

### Seeding Data

To seed the database with earthquake data:

```bash
# Download the earthquake CSV file
./scripts/download-earthquake-data.sh

# Then seed the database
cd packages/db
pnpm run seed
```

The seed script imports earthquake data from the CSV file located at `packages/db/data/earthquakes.csv`.

## Development Workflow

1. Make changes to your code
2. Run tests: `pnpm test`
3. Build the application: `pnpm build`

## License

Private - Not for distribution