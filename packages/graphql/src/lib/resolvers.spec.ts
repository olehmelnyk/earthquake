import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from './schema';
import { PrismaClient } from '@prisma/client';

// Define a mock prisma type for testing
type MockPrismaClient = {
  earthquake: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count?: ReturnType<typeof vi.fn>;
  }
};

// Define the Context interface locally instead of importing it
interface TestContext {
  prisma: MockPrismaClient;
}

// Mock PrismaClient type
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      earthquake: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
    }))
  };
});

describe('GraphQL Resolvers', () => {
  // Create mocked Prisma client
  const mockPrisma = new PrismaClient() as unknown as PrismaClient;

  // Mock context
  const context = {
    prisma: mockPrisma,
  };

  // Get the mocked earthquake methods for testing
  const earthquakeMethods = mockPrisma.earthquake as unknown as {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Query', () => {
    describe('earthquakes', () => {
      it('should return paginated earthquake data', async () => {
        const mockEarthquakes = [
          { id: '1', location: '40.123, -74.567', magnitude: 5.5, date: new Date('2023-01-01'), createdAt: new Date(), updatedAt: new Date() },
          { id: '2', location: '41.234, -75.678', magnitude: 6.0, date: new Date('2023-01-02'), createdAt: new Date(), updatedAt: new Date() },
          { id: '3', location: '42.345, -76.789', magnitude: 6.5, date: new Date('2023-01-03'), createdAt: new Date(), updatedAt: new Date() },
        ];

        const prisma = {
          earthquake: {
            findMany: vi.fn().mockResolvedValue(mockEarthquakes.slice(0, 2)),
            count: vi.fn().mockResolvedValue(3),
          },
        };

        const result = await resolvers.Query.earthquakes(
          null,
          { page: 1, limit: 2 },
          { prisma } as unknown as any
        );

        expect(prisma.earthquake.findMany).toHaveBeenCalledWith({
          where: {},
          orderBy: { date: 'desc' },
          skip: 0,
          take: 2,
        });

        expect(result).toEqual({
          data: mockEarthquakes.slice(0, 2),
          count: 3,
          hasMore: true,
        });
      });

      it('should apply filters correctly', async () => {
        const mockEarthquakes = [
          { id: '1', location: '40.123, -74.567', magnitude: 5.5, date: new Date('2023-01-01'), createdAt: new Date(), updatedAt: new Date() },
        ];

        const prisma = {
          earthquake: {
            findMany: vi.fn().mockResolvedValue(mockEarthquakes),
            count: vi.fn().mockResolvedValue(1),
          },
        };

        const result = await resolvers.Query.earthquakes(
          null,
          {
            filter: {
              dateFrom: '2023-01-01',
              dateTo: '2023-01-02',
              magnitudeFrom: 5.0,
              magnitudeTo: 6.0,
              location: '40.123',
            }
          },
          { prisma } as unknown as any
        );

        expect(prisma.earthquake.findMany).toHaveBeenCalledWith({
          where: {
            date: {
              gte: expect.any(Date),
              lte: expect.any(Date),
            },
            magnitude: {
              gte: 5.0,
              lte: 6.0,
            },
            location: {
              contains: '40.123',
              mode: 'insensitive',
            },
          },
          orderBy: { date: 'desc' },
          skip: 0,
          take: 10,
        });

        expect(result).toEqual({
          data: mockEarthquakes,
          count: 1,
          hasMore: false,
        });
      });

      it('should apply sorting correctly', async () => {
        const mockEarthquakes = [
          { id: '1', location: '40.123, -74.567', magnitude: 6.5, date: new Date('2023-01-01'), createdAt: new Date(), updatedAt: new Date() },
          { id: '2', location: '41.234, -75.678', magnitude: 6.0, date: new Date('2023-01-02'), createdAt: new Date(), updatedAt: new Date() },
          { id: '3', location: '42.345, -76.789', magnitude: 5.5, date: new Date('2023-01-03'), createdAt: new Date(), updatedAt: new Date() },
        ];

        const prisma = {
          earthquake: {
            findMany: vi.fn().mockResolvedValue(mockEarthquakes),
            count: vi.fn().mockResolvedValue(3),
          },
        };

        const result = await resolvers.Query.earthquakes(
          null,
          {
            sort: {
              field: 'magnitude',
              direction: 'desc',
            }
          },
          { prisma } as unknown as any
        );

        expect(prisma.earthquake.findMany).toHaveBeenCalledWith({
          where: {},
          orderBy: { magnitude: 'desc' },
          skip: 0,
          take: 10,
        });

        expect(result).toEqual({
          data: mockEarthquakes,
          count: 3,
          hasMore: false,
        });
      });

      it('should respect max limit', async () => {
        const prisma = {
          earthquake: {
            findMany: vi.fn().mockResolvedValue([]),
            count: vi.fn().mockResolvedValue(0),
          },
        };

        await resolvers.Query.earthquakes(
          null,
          { limit: 200 }, // Exceeds MAX_LIMIT
          { prisma } as unknown as any
        );

        expect(prisma.earthquake.findMany).toHaveBeenCalledWith({
          where: {},
          orderBy: { date: 'desc' },
          skip: 0,
          take: 100, // Should be capped at MAX_LIMIT
        });
      });
    });

    it('should get all earthquakes', async () => {
      const mockEarthquakes = [{ id: '1', location: '43.584, -127.638', magnitude: 5.5, date: new Date() }];
      const prisma = {
        earthquake: {
          findMany: vi.fn().mockResolvedValue(mockEarthquakes),
          count: vi.fn().mockResolvedValue(mockEarthquakes.length),
        },
      };

      const result = await resolvers.Query.earthquakes(null, {}, { prisma } as unknown as any);

      expect(prisma.earthquake.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        data: mockEarthquakes,
        count: mockEarthquakes.length,
        hasMore: false,
      });
    });

    it('should get earthquake by ID', async () => {
      const mockEarthquake = { id: '1', location: '43.584, -127.638', magnitude: 5.5, date: new Date() };
      earthquakeMethods.findUnique.mockResolvedValue(mockEarthquake);

      const result = await resolvers.Query.earthquake(undefined, { id: '1' }, context);

      expect(earthquakeMethods.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockEarthquake);
    });
  });

  describe('Mutation', () => {
    it('should create an earthquake', async () => {
      const mockDate = '2023-01-01T00:00:00Z';
      const mockEarthquake = {
        id: '1',
        location: '43.584, -127.638',
        magnitude: 5.5,
        date: new Date(mockDate),
      };

      earthquakeMethods.create.mockResolvedValue(mockEarthquake);

      const result = await resolvers.Mutation.addEarthquake(
        undefined,
        { location: '43.584, -127.638', magnitude: 5.5, date: mockDate },
        context
      );

      expect(earthquakeMethods.create).toHaveBeenCalledWith({
        data: {
          location: '43.584, -127.638',
          magnitude: 5.5,
          date: expect.any(Date),
        },
      });
      expect(result).toEqual(mockEarthquake);
    });

    it('should update an earthquake', async () => {
      const mockEarthquake = {
        id: '1',
        location: '43.584, -127.638',
        magnitude: 6.0,
        date: new Date(),
      };

      earthquakeMethods.update.mockResolvedValue(mockEarthquake);

      const result = await resolvers.Mutation.updateEarthquake(
        undefined,
        { id: '1', location: '43.584, -127.638', magnitude: 6.0 },
        context
      );

      expect(earthquakeMethods.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          'location': '43.584, -127.638',
          'magnitude': 6.0,
        }),
      });
      expect(result).toEqual(mockEarthquake);
    });

    it('should delete an earthquake', async () => {
      earthquakeMethods.delete.mockResolvedValue({ id: '1' });

      const result = await resolvers.Mutation.deleteEarthquake(
        undefined,
        { id: '1' },
        context
      );

      expect(earthquakeMethods.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });
  });
});