# Earthquake Tracker Project Overview

## Project Structure
This project is built as an NX monorepo with the following main parts:

### Apps
- **apps/web**: Next.js frontend application
- **apps/api**: Express backend with Apollo Server for GraphQL

### Packages
- **packages/ui**: ShadcnUI component library with Tailwind
- Various other utility packages

## Frontend Architecture

### Main Components
- **Dashboard (`Dashboard.tsx`)**: The main container component that orchestrates the entire UI
- **SidebarFilters (`SidebarFilters.tsx`)**: Handles filtering earthquakes by location, magnitude, and date
- **EarthquakeTable (`EarthquakeTable.tsx`)**: Displays earthquake data with sorting, pagination, and actions
- **EarthquakeForm (`EarthquakeForm.tsx`)**: Form for creating and editing earthquake records
- **ModeToggle (`ModeToggle.tsx`)**: Theme toggle component (light/dark mode)

### Data Management
- **useEarthquakeData**: Custom hook for handling GraphQL operations (queries and mutations)
- **useQueryParams**: Hook for synchronizing UI state with URL query parameters

### GraphQL Operations
- **Queries**: Fetching earthquake data with filters, pagination, and sorting
- **Mutations**: Adding, updating, and deleting earthquake records

### Form Validation
- Using Zod schemas for form validation (defined in `packages/ui/src/lib/schemas/earthquake.ts`)
- Validation for location format, magnitude range, and date constraints

## Backend Architecture
- Express server with Apollo GraphQL
- Prisma as ORM for database operations
- PostgreSQL database (Docker containerized)

## UI Component Library (packages/ui)
Follows atomic design principles:
- **Atoms**: Basic UI elements (Button, Input, Label, etc.)
- **Molecules**: Compound components (Dialog, Form, Toast, etc.)
- **Organisms**: Complex UI components (DataTable)

## Features Implemented
1. **Earthquake Data Management**:
   - View earthquake records in a data table
   - Add new earthquake records
   - Edit existing earthquake records
   - Delete earthquake records

2. **Filtering & Sorting**:
   - Filter by location
   - Filter by magnitude range
   - Filter by date range
   - Sort by any column

3. **Pagination**:
   - Navigate through pages of earthquake data
   - Adjust page size

4. **URL State Persistence**:
   - Filter settings preserved in URL query parameters
   - Supports browser navigation (back/forward)

5. **Responsive UI**:
   - Adapts to different screen sizes
   - Mobile-friendly layout

## Technology Stack
- NX Monorepo
- Next.js for frontend
- Express for backend
- Prisma as ORM
- PostgreSQL database
- ShadcnUI + Tailwind CSS
- Apollo GraphQL (both client and server)
- Zod for validation
- React Hook Form
- Storybook for component development
- Vitest for unit testing
- React Testing Library
- Playwright for E2E testing
- MSW for API mocking