import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '@earthquake/graphql';
import { prisma } from '@earthquake/db';
import cors from 'cors';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3333;

async function startApolloServer() {
  const app = express();

  // Configure CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins in development
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }));

  // Create Apollo GraphQL server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      prisma,
    }),
  });

  await server.start();
  server.applyMiddleware({
    app,
    // CORS options can also be applied here for GraphQL specifically
    cors: false // Already handled by express middleware
  });

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}${server.graphqlPath}`);
  });
}

startApolloServer().catch(err => {
  console.error('Failed to start server:', err);
});
