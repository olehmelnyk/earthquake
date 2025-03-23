import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from '@earthquake/graphql';
import { prisma } from '@earthquake/db';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3333;

interface ContextValue {
  prisma: typeof prisma;
}

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo GraphQL server
  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Configure CORS and middleware
  app.use(
    '/graphql',
    cors({
      origin: process.env.CORS_ORIGIN || '*', // Allow all origins in development
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400 // 24 hours
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => ({
        prisma,
      }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port, host }, resolve));
  console.log(`[ ready ] http://${host}:${port}/graphql`);
}

startApolloServer().catch(err => {
  console.error('Failed to start server:', err);
});
