'use client';

import React, { useState, useEffect, type FC } from 'react';
import { SidebarFilters } from './SidebarFilters';
import { EarthquakeTable, type Earthquake } from './EarthquakeTable';
import { EarthquakeForm } from './EarthquakeForm';
import { ModeToggle } from './ModeToggle';
import {
  Button,
  earthquakeFormSchema,
  earthquakeFilterSchema,
  type EarthquakeFormValues,
  type EarthquakeFilterValues
} from '@earthquake/ui';
import { useEarthquakeData, EarthquakeFilterVariables } from '../hooks/useEarthquakeData';
import { useQueryParams, SortConfig } from '../hooks/useQueryParams';

export const Dashboard: FC = () => {
  const {
    getFiltersFromQuery,
    getPageFromQuery,
    getSortFromQuery,
    updateFilters,
    updatePage,
    updateSort
  } = useQueryParams();

  // Initialize state from URL query parameters
  const [filters, setFilters] = useState<EarthquakeFilterValues>(getFiltersFromQuery());
  const [page, setPage] = useState(getPageFromQuery());
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<SortConfig>(getSortFromQuery());

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEarthquake, setEditingEarthquake] = useState<Earthquake | null>(null);

  // Transform the filters directly since our schema now matches the API
  const filterVariables: EarthquakeFilterVariables = {
    page,
    limit,
    filter: {
      ...(filters.location ? { location: filters.location } : {}),
      ...(filters.magnitudeFrom ? { magnitudeFrom: filters.magnitudeFrom } : {}),
      ...(filters.magnitudeTo ? { magnitudeTo: filters.magnitudeTo } : {}),
      ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
      ...(filters.dateTo ? { dateTo: filters.dateTo } : {})
    },
    sort
  };

  const {
    earthquakeData,
    loading,
    error,
    addEarthquakeRecord,
    updateEarthquakeRecord,
    deleteEarthquakeRecord
  } = useEarthquakeData(filterVariables);

  // Set up page change handler (updates both state and URL)
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updatePage(newPage);
  };

  // Set up page size change handler
  const handlePageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize);
    setPage(1); // Reset to page 1 when changing page size
    // Update URL with new page size and reset page to 1
    updatePage(1);
    // We could also add pageSize to URL params if needed
  };

  // Set up filter change handler (updates both state and URL)
  const handleFilterChange = (newFilters: EarthquakeFilterValues) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    updateFilters(newFilters);
  };

  // Set up sort change handler (updates both state and URL)
  const handleSortChange = (newSort: SortConfig) => {
    setSort(newSort);
    updateSort(newSort);
  };

  const handleAddClick = () => {
    setEditingEarthquake(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    const earthquake = earthquakeData?.data?.find((eq: Earthquake) => eq.id === id);
    if (earthquake) {
      setEditingEarthquake(earthquake);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    deleteEarthquakeRecord(id);
  };

  const handleFormSubmit = (formData: EarthquakeFormValues) => {
    if (editingEarthquake) {
      // Update existing earthquake
      updateEarthquakeRecord(editingEarthquake.id, formData);
      setIsFormOpen(false);
      setEditingEarthquake(null);
    } else {
      // Add new earthquake
      addEarthquakeRecord(formData);
      setIsFormOpen(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEarthquake(null);
  };

  // Listen for URL parameter changes (e.g., when user uses browser back/forward buttons)
  useEffect(() => {
    const urlFilters = getFiltersFromQuery();
    const urlPage = getPageFromQuery();
    const urlSort = getSortFromQuery();

    // Check if any filter value is different from current state
    const isFiltersDifferent = Object.entries(urlFilters).some(
      ([key, value]) => filters[key as keyof EarthquakeFilterValues] !== value
    );

    if (isFiltersDifferent) {
      setFilters(urlFilters);
    }

    if (page !== urlPage) {
      setPage(urlPage);
    }

    if (sort.field !== urlSort.field || sort.direction !== urlSort.direction) {
      setSort(urlSort);
    }
  }, [getFiltersFromQuery, getPageFromQuery, getSortFromQuery]);

  useEffect(() => {
    if (error) {
      console.error(`Failed to load data: ${error.message}`);
    }
  }, [error]);

  const earthquakes = earthquakeData?.data || [];
  const totalCount = earthquakeData?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <main className="bg-background min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">Earthquake Tracker</h1>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-57px)]">
        <SidebarFilters
          initialFilters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          <div className="w-full p-4 border-b border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Earthquake Data</h2>
              <Button
                onClick={handleAddClick}
              >
                Add New Record
              </Button>
            </div>
          </div>
          <div className="p-4">
            <EarthquakeTable
              earthquakes={earthquakes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSortChange={handleSortChange}
              currentSort={sort}
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSize={limit}
            />
          </div>
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {editingEarthquake ? 'Edit Earthquake Record' : 'Add New Earthquake Record'}
              </h3>
            </div>
            <EarthquakeForm
              earthquake={editingEarthquake ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </main>
  );
};