import { PrismaClient } from '@prisma/client';

// Default database URL for local development
const DEFAULT_DB_URL = 'postgresql://postgres:postgres@localhost:5433/earthquake?schema=public';

// Get database URL from environment or use default
const getDatabaseUrl = () => {
  console.log('NODE_ENV:', process.env['NODE_ENV']);
  console.log('Current working directory:', process.cwd());
  console.log('Raw DATABASE_URL:', process.env['DATABASE_URL']);
  const url = process.env['DATABASE_URL'] || DEFAULT_DB_URL;
  // Ensure we're using port 5433 in development
  if (process.env['NODE_ENV'] !== 'production' && url.includes('localhost:5432')) {
    return url.replace('localhost:5432', 'localhost:5433');
  }
  return url;
};

// Create Prisma client with the correct configuration
const createPrismaClient = () => {
  const dbUrl = getDatabaseUrl();
  console.log('Database URL:', dbUrl.replace(/:\/\/[^@]+@/, '://*****@'));

  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });
};

// Global instance for development to prevent too many connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Export the Prisma client instance
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test the connection and handle errors gracefully
async function validateConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');

    // Test query to ensure we have proper permissions
    await prisma.earthquake.count();
    console.log('Database connection and permissions verified');
  } catch (error) {
    console.error('Database connection error:', error);
    // In development, we want to fail fast
    if (process.env['NODE_ENV'] !== 'production') {
      process.exit(1);
    }
    // In production, we'll let the application handle the error
    throw error;
  }
}

// Run the validation if this is the main module
if (require.main === module) {
  validateConnection();
}

export * from '@prisma/client';

export function database(): string {
  return 'database';
}
