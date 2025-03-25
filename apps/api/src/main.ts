import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from '@earthquake/graphql';
import { prisma } from '@earthquake/db';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 4224;

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
    introspection: true, // Enable introspection in all environments
  });

  await server.start();

  // Configure CORS and middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.CORS_ORIGIN || '*', // Allow all origins in development
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400 // 24 hours
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        prisma,
      }),
    }),
  );

  // Add a health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Start the server
  httpServer.listen({ port, host }, () => {
    console.log(`[ ready ] http://${host}:${port}/graphql`);
  }).on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Error: Port ${port} is already in use. Please make sure no other service is running on this port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
}

startApolloServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
