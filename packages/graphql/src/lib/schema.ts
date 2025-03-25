import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { PrismaClient } from '@prisma/client';

// Define context type
interface Context {
  prisma: PrismaClient;
}

// Helper function to safely serialize dates to ISO strings
const serializeDate = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString();
};

export const typeDefs: DocumentNode = gql`
  type Earthquake {
    id: ID!
    location: String!
    magnitude: Float!
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedEarthquakes {
    data: [Earthquake!]!
    count: Int!
    hasMore: Boolean!
  }

  enum SortDirection {
    asc
    desc
  }

  input EarthquakeFilter {
    dateFrom: String
    dateTo: String
    magnitudeFrom: Float
    magnitudeTo: Float
    location: String
  }

  input EarthquakeSort {
    field: String!
    direction: SortDirection!
  }

  type Query {
    earthquakes(
      page: Int
      limit: Int
      filter: EarthquakeFilter
      sort: EarthquakeSort
    ): PaginatedEarthquakes!

    earthquake(id: ID!): Earthquake
  }

  type Mutation {
    addEarthquake(
      location: String!
      magnitude: Float!
      date: String!
    ): Earthquake!

    updateEarthquake(
      id: ID!
      location: String
      magnitude: Float
      date: String
    ): Earthquake!

    deleteEarthquake(id: ID!): Boolean!
  }
`;

interface EarthquakeUpdateInput {
  location?: string;
  magnitude?: number;
  date?: string;
}

interface AddEarthquakeArgs {
  location: string;
  magnitude: number;
  date: string;
}

interface UpdateEarthquakeArgs extends EarthquakeUpdateInput {
  id: string;
}

interface EarthquakeIdArg {
  id: string;
}

interface SortInput {
  field: string;
  direction: 'asc' | 'desc';
}

interface FilterInput {
  dateFrom?: string;
  dateTo?: string;
  magnitudeFrom?: number;
  magnitudeTo?: number;
  location?: string;
}

interface EarthquakesQueryArgs {
  page?: number;
  limit?: number;
  filter?: FilterInput;
  sort?: SortInput;
}

// Default and max values for pagination
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const resolvers = {
  // Custom resolvers to consistently format dates
  Earthquake: {
    date: (parent: any) => serializeDate(parent.date),
    createdAt: (parent: any) => serializeDate(parent.createdAt),
    updatedAt: (parent: any) => serializeDate(parent.updatedAt),
  },
  Query: {
    earthquakes: async (_: unknown, args: EarthquakesQueryArgs, { prisma }: Context) => {
      // Pagination
      const page = args.page || DEFAULT_PAGE;
      const limit = Math.min(args.limit || DEFAULT_LIMIT, MAX_LIMIT);
      const skip = (page - 1) * limit;

      // Filtering
      const filter = args.filter || {};
      const where: any = {};

      if (filter.dateFrom || filter.dateTo) {
        where.date = {};
        if (filter.dateFrom) {
          where.date.gte = new Date(filter.dateFrom);
        }
        if (filter.dateTo) {
          where.date.lte = new Date(filter.dateTo);
        }
      }

      if (filter.magnitudeFrom || filter.magnitudeTo) {
        where.magnitude = {};
        if (filter.magnitudeFrom) {
          where.magnitude.gte = filter.magnitudeFrom;
        }
        if (filter.magnitudeTo) {
          where.magnitude.lte = filter.magnitudeTo;
        }
      }

      if (filter.location) {
        // Simple contains search for location
        where.location = {
          contains: filter.location,
        };
      }

      // Sorting
      const orderBy: any = {};
      if (args.sort) {
        orderBy[args.sort.field] = args.sort.direction;
      } else {
        // Default sorting by date (newest first)
        orderBy.date = 'desc';
      }

      // Execute queries
      const [data, count] = await Promise.all([
        prisma.earthquake.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.earthquake.count({ where }),
      ]);

      console.log('Query parameters:', {
        where,
        orderBy,
        skip,
        take: limit,
      });
      console.log('Query results:', {
        dataLength: data.length,
        totalCount: count,
        hasMore: skip + data.length < count,
      });

      return {
        data,
        count,
        hasMore: skip + data.length < count,
      };
    },
    earthquake: async (_: unknown, { id }: EarthquakeIdArg, { prisma }: Context) => {
      return prisma.earthquake.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    addEarthquake: async (_: unknown, { location, magnitude, date }: AddEarthquakeArgs, { prisma }: Context) => {
      // Round location coordinates to 3 decimal places if it's in "lat, long" format
      let roundedLocation = location;
      if (location.includes(',')) {
        const [lat, long] = location.split(',').map(part => part.trim());
        const roundedLat = parseFloat(parseFloat(lat).toFixed(3));
        const roundedLong = parseFloat(parseFloat(long).toFixed(3));
        roundedLocation = `${roundedLat}, ${roundedLong}`;
      }

      return prisma.earthquake.create({
        data: {
          location: roundedLocation,
          magnitude,
          date: new Date(date),
        },
      });
    },
    updateEarthquake: async (_: unknown, { id, ...data }: UpdateEarthquakeArgs, { prisma }: Context) => {
      const updateData: Record<string, string | number | Date> = {};

      if (data.location !== undefined) {
        let roundedLocation = data.location;
        if (data.location.includes(',')) {
          const [lat, long] = data.location.split(',').map(part => part.trim());
          const roundedLat = parseFloat(parseFloat(lat).toFixed(3));
          const roundedLong = parseFloat(parseFloat(long).toFixed(3));
          roundedLocation = `${roundedLat}, ${roundedLong}`;
        }
        updateData['location'] = roundedLocation;
      }

      if (data.magnitude !== undefined) updateData['magnitude'] = data.magnitude;
      if (data.date !== undefined) updateData['date'] = new Date(data.date);

      return prisma.earthquake.update({
        where: { id },
        data: updateData,
      });
    },
    deleteEarthquake: async (_: unknown, { id }: EarthquakeIdArg, { prisma }: Context) => {
      try {
        await prisma.earthquake.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        console.error('Error deleting earthquake:', error);
        return false;
      }
    },
  },
};

export default typeDefs;