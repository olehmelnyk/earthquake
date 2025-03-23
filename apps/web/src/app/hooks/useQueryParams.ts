'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { type EarthquakeFilterValues } from '@earthquake/ui';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Function to update the query parameters
  const setQueryParams = useCallback((params: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    const queryString = newParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
  }, [pathname, router, searchParams]);

  // Parse filters from query parameters
  const getFiltersFromQuery = useCallback((): EarthquakeFilterValues => {
    return {
      location: searchParams.get('location') ?? '',
      magnitudeFrom: Number(searchParams.get('magnitudeFrom') ?? 0),
      magnitudeTo: Number(searchParams.get('magnitudeTo') ?? 10),
      dateFrom: searchParams.get('dateFrom') ?? '',
      dateTo: searchParams.get('dateTo') ?? '',
    };
  }, [searchParams]);

  // Parse page from query parameters
  const getPageFromQuery = useCallback((): number => {
    return Number(searchParams.get('page') ?? 1);
  }, [searchParams]);

  // Parse sort from query parameters
  const getSortFromQuery = useCallback((): SortConfig => {
    const field = searchParams.get('sortField') ?? 'date';
    const direction = (searchParams.get('sortDir') ?? 'desc') as 'asc' | 'desc';
    return { field, direction };
  }, [searchParams]);

  // Update url with filters
  const updateFilters = useCallback((filters: EarthquakeFilterValues) => {
    setQueryParams({
      location: filters.location,
      magnitudeFrom: filters.magnitudeFrom ?? undefined,
      magnitudeTo: filters.magnitudeTo === 10 ? undefined : filters.magnitudeTo,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      page: 1, // Reset to page 1 when filters change
    });
  }, [setQueryParams]);

  // Update url with page
  const updatePage = useCallback((page: number) => {
    setQueryParams({ page: page === 1 ? undefined : page });
  }, [setQueryParams]);

  // Update url with sort
  const updateSort = useCallback((sort: SortConfig) => {
    // Always include both sort parameters to ensure UI state is preserved
    setQueryParams({
      sortField: sort.field,
      sortDir: sort.direction,
    });
  }, [setQueryParams]);

  return {
    getFiltersFromQuery,
    getPageFromQuery,
    getSortFromQuery,
    updateFilters,
    updatePage,
    updateSort,
  };
}