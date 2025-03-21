import { describe, it, expect, vi } from 'vitest';
import { resolvers } from './schema';
import { PrismaClient } from '@prisma/client';

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
    it('should get all earthquakes', async () => {
      const mockEarthquakes = [{ id: '1', location: 'Tokyo', magnitude: 5.5, date: new Date() }];
      earthquakeMethods.findMany.mockResolvedValue(mockEarthquakes);

      const result = await resolvers.Query.earthquakes(undefined, {}, context);

      expect(earthquakeMethods.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockEarthquakes);
    });

    it('should get earthquake by ID', async () => {
      const mockEarthquake = { id: '1', location: 'Tokyo', magnitude: 5.5, date: new Date() };
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
        location: 'Tokyo',
        magnitude: 5.5,
        date: new Date(mockDate),
      };

      earthquakeMethods.create.mockResolvedValue(mockEarthquake);

      const result = await resolvers.Mutation.createEarthquake(
        undefined,
        { location: 'Tokyo', magnitude: 5.5, date: mockDate },
        context
      );

      expect(earthquakeMethods.create).toHaveBeenCalledWith({
        data: {
          location: 'Tokyo',
          magnitude: 5.5,
          date: expect.any(Date),
        },
      });
      expect(result).toEqual(mockEarthquake);
    });

    it('should update an earthquake', async () => {
      const mockEarthquake = {
        id: '1',
        location: 'Tokyo Updated',
        magnitude: 6.0,
        date: new Date(),
      };

      earthquakeMethods.update.mockResolvedValue(mockEarthquake);

      const result = await resolvers.Mutation.updateEarthquake(
        undefined,
        { id: '1', location: 'Tokyo Updated', magnitude: 6.0 },
        context
      );

      expect(earthquakeMethods.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          'location': 'Tokyo Updated',
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