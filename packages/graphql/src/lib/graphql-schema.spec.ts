import { describe, it, expect } from 'vitest';
import { typeDefs } from './schema';

describe('GraphQL Schema', () => {
  it('should export the typeDefs', () => {
    expect(typeDefs).toBeDefined();
  });

  it('should include Earthquake type', () => {
    expect(typeDefs.loc?.source.body).toContain('type Earthquake');
  });
});
