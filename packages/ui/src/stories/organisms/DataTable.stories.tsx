import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../lib/atoms/button';
import { ColumnDef } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../lib/organisms/data-table/table';
import * as React from 'react';
import { SimpleDataTable } from './SimpleDataTable';

// Define a sample data type
type Earthquake = {
  id: string;
  location: string;
  magnitude: number;
  date: string;
};

// Sample data
const earthquakeData: Earthquake[] = [
  { id: '1', location: 'San Francisco, CA', magnitude: 5.2, date: '2023-01-15' },
  { id: '2', location: 'Tokyo, Japan', magnitude: 4.7, date: '2023-02-22' },
  { id: '3', location: 'Mexico City, Mexico', magnitude: 6.1, date: '2023-03-10' },
  { id: '4', location: 'Lima, Peru', magnitude: 5.8, date: '2023-04-05' },
  { id: '5', location: 'Santiago, Chile', magnitude: 4.9, date: '2023-05-18' },
  { id: '6', location: 'Reykjavik, Iceland', magnitude: 3.6, date: '2023-06-27' },
  { id: '7', location: 'Anchorage, AK', magnitude: 5.5, date: '2023-07-15' },
  { id: '8', location: 'Kathmandu, Nepal', magnitude: 6.7, date: '2023-08-09' },
  { id: '9', location: 'Los Angeles, CA', magnitude: 4.3, date: '2023-09-11' },
  { id: '10', location: 'Athens, Greece', magnitude: 5.1, date: '2023-10-23' },
];

// Define columns
const columns: ColumnDef<Earthquake>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'magnitude',
    header: 'Magnitude',
    cell: ({ row }) => {
      const magnitude = parseFloat(row.getValue('magnitude'));
      return (
        <div>
          {magnitude}
          <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
            magnitude > 6 ? 'bg-red-500' : magnitude > 5 ? 'bg-orange-500' : 'bg-green-500'
          }`} />
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="destructive">Delete</Button>
        </div>
      );
    },
  },
];

// Manual table implementation that doesn't rely on DataTable component
const ManualTable = () => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id || (column as any).accessorKey?.toString()}>
              {typeof column.header === 'string'
                ? column.header
                : (column as any).accessorKey?.toString()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {earthquakeData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.location}</TableCell>
            <TableCell>
              <div>
                {row.magnitude}
                <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
                  row.magnitude > 6 ? 'bg-red-500' : row.magnitude > 5 ? 'bg-orange-500' : 'bg-green-500'
                }`} />
              </div>
            </TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Try to use the SimpleDataTable component (which should work in Storybook)
const DataTableWithFallback = () => {
  return (
    <div className="container mx-auto py-10">
      <SimpleDataTable
        columns={columns}
        data={earthquakeData}
      />
    </div>
  );
};

// Create a simpler manual version for the story
const DataTableDemo = () => {
  return (
    <div className="container mx-auto py-10">
      <ManualTable />
      <div className="mt-4">
        {/* Simplified pagination UI for demo purposes */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Page 1 of 1
          </div>
          <div className="text-sm text-muted-foreground">
            Rows per page: 10
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof DataTableDemo> = {
  title: 'Organisms/DataTable',
  component: DataTableDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTableDemo>;

export const Default: Story = {};

export const WithDataTableComponent: StoryObj<typeof DataTableWithFallback> = {
  render: () => <DataTableWithFallback />
};