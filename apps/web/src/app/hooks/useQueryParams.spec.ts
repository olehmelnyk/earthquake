import { useQueryParams } from './useQueryParams';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Mock React hooks
vi.mock('react', () => ({
  useCallback: (callback: Function) => callback
}));

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn()
}));

describe('useQueryParams', () => {
  const pushMock = vi.fn();
  const mockSearchParams = new Map();
  const searchParamsMock = {
    get: (key: string) => mockSearchParams.get(key) ?? null,
    has: (key: string) => mockSearchParams.has(key),
    toString: () => {
      const parts: string[] = [];
      mockSearchParams.forEach((value, key) => {
        parts.push(`${key}=${encodeURIComponent(value)}`);
      });
      return parts.join('&');
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.clear();

    // Setup default mocks
    vi.mocked(usePathname).mockReturnValue('/earthquakes');
    vi.mocked(useSearchParams).mockReturnValue(searchParamsMock as any);
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn()
    } as any);
  });

  it('should get empty filters when no query params exist', () => {
    const { result } = renderHook(() => useQueryParams());
    const filters = result.current.getFiltersFromQuery();

    expect(filters).toEqual({
      location: '',
      magnitudeFrom: 0,
      magnitudeTo: 10,
      dateFrom: '',
      dateTo: ''
    });
  });

  it('should get filters from query params', () => {
    mockSearchParams.set('location', '35.6762, 139.6503');
    mockSearchParams.set('magnitudeFrom', '5');
    mockSearchParams.set('magnitudeTo', '8');
    mockSearchParams.set('dateFrom', '2023-04-01');
    mockSearchParams.set('dateTo', '2023-04-30');

    const { result } = renderHook(() => useQueryParams());
    const filters = result.current.getFiltersFromQuery();

    expect(filters).toEqual({
      location: '35.6762, 139.6503',
      magnitudeFrom: 5,
      magnitudeTo: 8,
      dateFrom: '2023-04-01',
      dateTo: '2023-04-30'
    });
  });

  it('should get default page when no page param exists', () => {
    const { result } = renderHook(() => useQueryParams());
    const page = result.current.getPageFromQuery();

    expect(page).toBe(1);
  });

  it('should get page from query params', () => {
    mockSearchParams.set('page', '3');

    const { result } = renderHook(() => useQueryParams());
    const page = result.current.getPageFromQuery();

    expect(page).toBe(3);
  });

  it('should get default sort when no sort params exist', () => {
    const { result } = renderHook(() => useQueryParams());
    const sort = result.current.getSortFromQuery();

    expect(sort).toEqual({
      field: 'date',
      direction: 'desc'
    });
  });

  it('should get sort from query params', () => {
    mockSearchParams.set('sortField', 'magnitude');
    mockSearchParams.set('sortDir', 'asc');

    const { result } = renderHook(() => useQueryParams());
    const sort = result.current.getSortFromQuery();

    expect(sort).toEqual({
      field: 'magnitude',
      direction: 'asc'
    });
  });

  it('should update filters in URL when updateFilters is called', () => {
    const { result } = renderHook(() => useQueryParams());

    result.current.updateFilters({
      location: '35.6762, 139.6503',
      magnitudeFrom: 5,
      magnitudeTo: 8,
      dateFrom: '2023-04-01',
      dateTo: '2023-04-30'
    });

    expect(pushMock).toHaveBeenCalledTimes(1);

    // Check that the URL contains all the expected parameters
    const url = pushMock.mock.calls[0][0];
    expect(url).toContain('location=35.6762%2C+139.6503');
    expect(url).toContain('magnitudeFrom=5');
    expect(url).toContain('magnitudeTo=8');
    expect(url).toContain('dateFrom=2023-04-01');
    expect(url).toContain('dateTo=2023-04-30');
    expect(url).toContain('page=1');
  });

  it('should update page in URL when updatePage is called', () => {
    const { result } = renderHook(() => useQueryParams());

    result.current.updatePage(5);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/earthquakes?page=5');
  });

  it('should not include page param when page is 1', () => {
    const { result } = renderHook(() => useQueryParams());

    result.current.updatePage(1);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/earthquakes');
  });

  it('should update sort in URL when updateSort is called', () => {
    const { result } = renderHook(() => useQueryParams());

    result.current.updateSort({
      field: 'magnitude',
      direction: 'asc'
    });

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/earthquakes?sortField=magnitude&sortDir=asc');
  });
});