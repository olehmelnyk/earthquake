import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '@earthquake/graphql';
import { prisma } from '@earthquake/db';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3333;

interface EarthquakeUpdateInput {
  location?: string;
  magnitude?: number;
  date?: string;
}

async function startApolloServer() {
  const app = express();

  // Create Apollo GraphQL server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      prisma,
    }),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}${server.graphqlPath}`);
  });
}

startApolloServer().catch(err => {
  console.error('Failed to start server:', err);
});
