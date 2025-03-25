import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create server instance for Node.js environment (for testing)
export const server = setupServer(...handlers);