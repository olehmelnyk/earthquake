"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  Column,
  Header,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "../../utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[];
  readonly data: TData[];
  readonly onRowClick?: (row: TData) => void;
  readonly enableSorting?: boolean;
  readonly initialSortingState?: SortingState;
  readonly onColumnHeaderClick?: (column: Column<TData, unknown>) => void;
  // External pagination props
  readonly totalCount?: number;
  readonly currentPage?: number;
  readonly pageSize?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: number) => void;
  // Pagination visibility options
  readonly showPagination?: boolean;
  readonly showTopPagination?: boolean;
  readonly showBottomPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  enableSorting = true,
  initialSortingState,
  onColumnHeaderClick,
  // External pagination props
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  // Pagination visibility options
  showPagination = true,
  showTopPagination = false,
  showBottomPagination = true,
}: DataTableProps<TData, TValue>) {
  // Use initialSortingState for the initial state
  const [sorting, setSorting] = React.useState<SortingState>(initialSortingState || []);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Update internal sorting state when initialSortingState changes
  React.useEffect(() => {
    if (initialSortingState) {
      setSorting(initialSortingState);
    }
  }, [initialSortingState]);

  // Use external page size if provided
  const initialPageSize = pageSize ?? 10;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableSorting,
    // Set initial pagination state
    initialState: {
      pagination: {
        pageSize: initialPageSize,
        pageIndex: currentPage ? currentPage - 1 : 0,
      },
      sorting: initialSortingState || [],
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    // Disable table's pagination if we're using external pagination
    manualPagination: !!onPageChange,
    pageCount: totalPages ?? -1,
    manualSorting: !!onColumnHeaderClick,
  });

  const handleHeaderClick = React.useCallback((column: Column<TData, unknown>) => {
    if (!column.getCanSort()) return;

    if (onColumnHeaderClick) {
      onColumnHeaderClick(column);
    } else {
      column.toggleSorting();
    }
  }, [onColumnHeaderClick]);

  const renderHeaderContent = React.useCallback((header: Header<TData, unknown>) => {
    if (header.isPlaceholder) {
      return null;
    }

    const column = header.column;
    const isSortable = column.getCanSort();
    const sortDirection = column.getIsSorted();

    return (
      <div
        className={cn(
          "flex items-center gap-2",
          isSortable && "cursor-pointer select-none"
        )}
        onClick={isSortable ? () => handleHeaderClick(column) : undefined}
      >
        <span>
          {flexRender(
            header.column.columnDef.header,
            header.getContext()
          )}
        </span>

        {isSortable && (
          <span className="flex-shrink-0">
            {sortDirection === false && (
              <ArrowUpDown className="h-4 w-4 text-muted-foreground/70" />
            )}
            {sortDirection === "asc" && (
              <ArrowUp className="h-4 w-4 text-primary" />
            )}
            {sortDirection === "desc" && (
              <ArrowDown className="h-4 w-4 text-primary" />
            )}
          </span>
        )}
      </div>
    );
  }, [handleHeaderClick]);

  const paginationProps = {
    table,
    totalCount,
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSize: pageSize || table.getState().pagination.pageSize,
  };

  return (
    <div className="space-y-4 w-full">
      {showPagination && showTopPagination && (
        <div className="bg-card rounded-md border border-border shadow-sm">
          <DataTablePagination
            {...paginationProps}
            hideNavigation={true}
          />
        </div>
      )}

      <div className="rounded-md border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {renderHeaderContent(header)}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && showBottomPagination && (
        <div className="bg-card rounded-md border border-border shadow-sm">
          <DataTablePagination {...paginationProps} />
        </div>
      )}
    </div>
  );
}