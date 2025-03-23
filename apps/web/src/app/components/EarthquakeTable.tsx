'use client';

import React, { useCallback } from 'react';
import type { FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import {
  DataTable,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge
} from '@earthquake/ui';
import { SortConfig } from '../hooks/useQueryParams';
import { EarthquakeSeverityBadge } from '../earthquakes/components/earthquake-severity-badge';

export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  depth?: number;
}

interface EarthquakeTableProps {
  readonly earthquakes: Earthquake[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onSortChange?: (sort: SortConfig) => void;
  readonly currentSort?: SortConfig;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly totalCount?: number;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: number) => void;
  readonly pageSize?: number;
}

// Helper function to format date and time
const formatDateTime = (dateString: string): string => {
  try {
    // Check if dateString is empty
    if (!dateString) {
      return 'N/A';
    }

    // Parse with dayjs for better cross-browser support
    // First convert to a number if it's a timestamp string to handle potential number formatting issues
    const isTimestampString = /^\d+$/.test(dateString);
    const date = isTimestampString
      ? dayjs(parseInt(dateString, 10))
      : dayjs(dateString);

    // Check if valid date
    if (!date.isValid()) {
      console.warn('Invalid date:', dateString);
      return 'Invalid date';
    }

    // Check if year is unreasonably large (could be parsing milliseconds as years)
    const year = date.year();
    if (year > 2100 || year < 1900) {
      console.warn('Year out of reasonable range:', year, 'from date string:', dateString);

      // Try to parse it as a Unix timestamp in milliseconds
      const millisecondDate = dayjs(parseInt(dateString, 10));
      if (millisecondDate.isValid() && millisecondDate.year() >= 1900 && millisecondDate.year() <= 2100) {
        return millisecondDate.format('MMM D, YYYY h:mm A');
      }

      // Try to parse it as a Unix timestamp in seconds
      const secondsDate = dayjs(parseInt(dateString, 10) * 1000);
      if (secondsDate.isValid() && secondsDate.year() >= 1900 && secondsDate.year() <= 2100) {
        return secondsDate.format('MMM D, YYYY h:mm A');
      }
    }

    // Format with dayjs
    return date.format('MMM D, YYYY h:mm A');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};

// Get magnitude color based on value
const getMagnitudeColor = (magnitude: number): 'destructive' | 'warning' | 'secondary' | 'default' => {
  if (magnitude >= 7) return 'destructive';
  if (magnitude >= 5) return 'warning';
  if (magnitude >= 3) return 'secondary';
  return 'default';
};

// Action cell component extracted outside the main component
interface ActionCellProps {
  readonly row: { original: Earthquake };
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

const ActionCell: FC<ActionCellProps> = ({ row, onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onEdit(row.original.id)}
      className="h-8 w-8"
    >
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            earthquake record from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(row.original.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

// Location cell component extracted outside the main component
interface LocationCellProps {
  readonly location: string;
}

const LocationCell: FC<LocationCellProps> = ({ location }) => (
  <div className="max-w-[250px] truncate" title={location}>
    {location}
  </div>
);

// Magnitude cell component extracted outside the main component
interface MagnitudeCellProps {
  readonly magnitude: number;
}

const MagnitudeCell: FC<MagnitudeCellProps> = ({ magnitude }) => (
  <Badge variant={getMagnitudeColor(magnitude)} size="default" className="w-16 text-center">
    {magnitude.toFixed(1)}
  </Badge>
);

// Date cell component extracted outside the main component
interface DateCellProps {
  readonly date: string;
}

const DateCell: FC<DateCellProps> = ({ date }) => (
  <div className="whitespace-nowrap">
    {formatDateTime(date)}
  </div>
);

// Create columns definition function outside main component
const createEarthquakeColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<Earthquake, any>[] => [
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <LocationCell location={row.original.location} />,
    enableSorting: true,
  },
  {
    accessorKey: 'magnitude',
    header: 'Magnitude',
    cell: ({ row }) => <MagnitudeCell magnitude={row.original.magnitude} />,
    enableSorting: true,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <DateCell date={row.original.date} />,
    enableSorting: true,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <ActionCell
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
    enableSorting: false,
  },
];

export const EarthquakeTable: FC<EarthquakeTableProps> = ({
  earthquakes,
  onEdit,
  onDelete,
  onSortChange,
  currentSort = { field: "date", direction: "desc" },
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  pageSize = 10
}) => {
  // Handle sorting changes from the table
  const handleSortingChange = useCallback((field: string) => {
    if (!onSortChange) return;

    // If already sorting by this field, toggle direction
    if (currentSort.field === field) {
      onSortChange({
        field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Default to ascending when selecting a new field
      onSortChange({
        field,
        direction: 'asc',
      });
    }
  }, [currentSort, onSortChange]);

  // Get columns using the extracted function
  const columns = React.useMemo(
    () => createEarthquakeColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={earthquakes}
        enableSorting={true}
        initialSortingState={currentSort ? [{ id: currentSort.field, desc: currentSort.direction === 'desc' }] : []}
        onColumnHeaderClick={(column) => {
          if (!onSortChange) return;

          const id = column.id;

          // If already sorting by this field, toggle direction
          if (currentSort.field === id) {
            onSortChange({
              field: id,
              direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
            });
          } else {
            // New field, default to ascending
            onSortChange({
              field: id,
              direction: 'asc',
            });
          }
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showTopPagination={false}
      />
      {earthquakes.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No earthquake records found. Try adjusting your filters or add a new record.
        </div>
      )}
    </div>
  );
};