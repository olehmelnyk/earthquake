import { describe, it, expect, vi } from 'vitest';
import { database } from './database';

// Mock the Prisma client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    // Add any required mock methods here
  })),
}));

describe('database', () => {
  it('should work', () => {
    expect(database()).toEqual('database');
  });
});
