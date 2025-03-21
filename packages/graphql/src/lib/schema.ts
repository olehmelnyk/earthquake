import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { PrismaClient } from '@prisma/client';

// Define context type
interface Context {
  prisma: PrismaClient;
}

export const typeDefs: DocumentNode = gql`
  type Earthquake {
    id: ID!
    location: String!
    magnitude: Float!
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    earthquakes: [Earthquake!]!
    earthquake(id: ID!): Earthquake
  }

  type Mutation {
    createEarthquake(
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

interface CreateEarthquakeArgs {
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

export const resolvers = {
  Query: {
    earthquakes: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.earthquake.findMany();
    },
    earthquake: async (_: unknown, { id }: EarthquakeIdArg, { prisma }: Context) => {
      return prisma.earthquake.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createEarthquake: async (_: unknown, { location, magnitude, date }: CreateEarthquakeArgs, { prisma }: Context) => {
      return prisma.earthquake.create({
        data: {
          location,
          magnitude,
          date: new Date(date),
        },
      });
    },
    updateEarthquake: async (_: unknown, { id, ...data }: UpdateEarthquakeArgs, { prisma }: Context) => {
      const updateData: Record<string, string | number | Date> = {};

      if (data.location !== undefined) updateData['location'] = data.location;
      if (data.magnitude !== undefined) updateData['magnitude'] = data.magnitude;
      if (data.date !== undefined) updateData['date'] = new Date(data.date);

      return prisma.earthquake.update({
        where: { id },
        data: updateData,
      });
    },
    deleteEarthquake: async (_: unknown, { id }: EarthquakeIdArg, { prisma }: Context) => {
      await prisma.earthquake.delete({
        where: { id },
      });
      return true;
    },
  },
};

export default typeDefs;