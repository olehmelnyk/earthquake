declare module '@earthquake/ui' {
  import type { FC, ReactNode, ComponentProps, Ref } from 'react';

  // Field types for form
  type FieldProps<T = unknown> = {
    onChange: (value: T) => void;
    onBlur: () => void;
    value: T;
    name: string;
    ref?: Ref<HTMLInputElement>;
  };

  // Export Button component
  export const Button: FC<{
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'warning';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children: ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
  }>;

  // Export Form components
  export const Form: FC<{
    [key: string]: any;
    children: ReactNode;
  }>;

  export const FormControl: FC<{
    children: ReactNode;
    className?: string;
  }>;

  export const FormField: FC<{
    control: any;
    name: string;
    render: (props: { field: FieldProps<any> }) => ReactNode;
  }>;

  export const FormItem: FC<{
    children: ReactNode;
    className?: string;
  }>;

  export const FormLabel: FC<{
    children: ReactNode;
    className?: string;
  }>;

  export const FormMessage: FC<{
    children?: ReactNode;
    className?: string;
  }>;

  // Export Input component
  export const Input: FC<ComponentProps<'input'> & {
    ref?: Ref<HTMLInputElement>;
  }>;

  // Export ValidationWarning component
  export const ValidationWarning: FC<{ message: string }>;

  // Export schema
  export const EarthquakeSchema: import('zod').ZodSchema<any>;

  // Dialog components
  export const AlertDialog: FC<{ children: ReactNode }>;
  export const AlertDialogAction: FC<{
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }>;
  export const AlertDialogCancel: FC<{ children: ReactNode }>;
  export const AlertDialogContent: FC<{ children: ReactNode; className?: string }>;
  export const AlertDialogDescription: FC<{ children: ReactNode }>;
  export const AlertDialogFooter: FC<{ children: ReactNode }>;
  export const AlertDialogHeader: FC<{ children: ReactNode }>;
  export const AlertDialogTitle: FC<{ children: ReactNode }>;
  export const AlertDialogTrigger: FC<{
    children: ReactNode;
    asChild?: boolean;
  }>;

  // Badge component
  export const Badge: FC<{
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    children: ReactNode;
  }>;

  // DataTable component
  export const DataTable: FC<{
    columns: any[];
    data: any[];
    onRowClick?: (row: any) => void;
    enableSorting?: boolean;
    initialSortingState?: { id: string; desc: boolean }[];
    onColumnHeaderClick?: (column: any) => void;
    // External pagination props
    totalCount?: number;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    // Pagination visibility options
    showPagination?: boolean;
    showTopPagination?: boolean;
    showBottomPagination?: boolean;
  }>;

  // Theme provider
  export const ThemeProvider: FC<{
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
  }>;

  export const Toaster: FC;

  // Toast hook
  export const useToast: () => {
    success: (props: { title: string; description: string }) => void;
    error: (props: { title: string; description: string }) => void;
    warning: (props: { title: string; description: string }) => void;
  };
}