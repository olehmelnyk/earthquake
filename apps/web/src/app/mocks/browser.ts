import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create worker instance
export const worker = setupWorker(...handlers);