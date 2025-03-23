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
  // Custom class name
  readonly className?: string;
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
  // Custom class name
  className,
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
    <div className={cn("flex flex-col h-full", className)}>
      {showPagination && showTopPagination && (
        <div className="bg-card rounded-md border border-border shadow-sm mb-4">
          <DataTablePagination
            {...paginationProps}
            hideNavigation={true}
          />
        </div>
      )}

      <div className="rounded-md border border-border flex-1 flex flex-col overflow-hidden">
        {/* Fixed header */}
        <div className="bg-background z-10">
          <table className="w-full caption-bottom text-sm table-fixed">
            <thead className="bg-muted/50 [&_tr]:border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                      style={{ width: header.getSize() }}
                    >
                      {renderHeaderContent(header)}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 108px)' }}>
          <table className="w-full caption-bottom text-sm table-fixed">
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                      onRowClick && "cursor-pointer"
                    )}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-4 align-middle"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="border-b border-border">
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center p-4"
                  >
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && showBottomPagination && (
        <div className="bg-card rounded-md border border-border shadow-sm mt-4">
          <DataTablePagination {...paginationProps} />
        </div>
      )}
    </div>
  );
}