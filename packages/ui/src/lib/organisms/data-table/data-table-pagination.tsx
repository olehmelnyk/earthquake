import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "../../atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";

interface DataTablePaginationProps<TData> {
  readonly table: Table<TData>;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly pageSize?: number;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: number) => void;
  readonly hideRowsPerPage?: boolean;
  readonly hideNavigation?: boolean;
}

export function DataTablePagination<TData>({
  table,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  hideRowsPerPage = false,
  hideNavigation = false,
}: DataTablePaginationProps<TData>) {
  // Use external pagination values if provided, otherwise use table's internal state
  const page = currentPage ?? table.getState().pagination.pageIndex + 1;
  const pageCount = totalPages ?? table.getPageCount();
  const currentPageSize = pageSize ?? table.getState().pagination.pageSize;

  // Handle page changes (either internal or external)
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      table.setPageIndex(newPage - 1);
    }
  };

  // Handle page size changes
  const handlePageSizeChange = (value: string) => {
    const size = Number(value);
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      table.setPageSize(size);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      {!hideRowsPerPage && (
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${currentPageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={currentPageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[70px]">
              {[10, 20, 30, 40, 50].map((pageSizeOption) => (
                <SelectItem key={pageSizeOption} value={`${pageSizeOption}`}>
                  {pageSizeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!hideNavigation && (
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center text-sm font-medium">
            Page {page} of {pageCount || 1}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pageCount}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => handlePageChange(pageCount)}
              disabled={page >= pageCount}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}