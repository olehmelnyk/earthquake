import { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../lib/atoms/calendar';
import { useState } from 'react';
import { addDays } from 'date-fns';
import React from 'react';

const meta: Meta<typeof Calendar> = {
  title: 'Atoms/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'The selection mode of the calendar',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Whether to show days from the previous/next month',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// Single date selection
const SingleCalendar = (props: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="border rounded-md">
      <Calendar
        {...props}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md"
      />
    </div>
  );
};

export const SingleSelection: Story = {
  args: {
    mode: 'single',
    showOutsideDays: true,
  },
  render: (args) => <SingleCalendar {...args} />,
};

// Multiple selection
const MultipleCalendar = (props: any) => {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
  ]);
  return (
    <div className="border rounded-md">
      <Calendar
        {...props}
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md"
      />
    </div>
  );
};

export const MultipleSelection: Story = {
  args: {
    mode: 'multiple',
    showOutsideDays: true,
  },
  render: (args) => <MultipleCalendar {...args} />,
};

// Range selection
const RangeCalendar = (props: any) => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  return (
    <div className="border rounded-md">
      <Calendar
        {...props}
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
        className="rounded-md"
      />
    </div>
  );
};

export const RangeSelection: Story = {
  args: {
    mode: 'range',
    showOutsideDays: true,
  },
  render: (args) => <RangeCalendar {...args} />,
};

// Without outside days
const CalendarWithoutOutsideDays = (props: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="border rounded-md">
      <Calendar
        {...props}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md"
      />
    </div>
  );
};

export const WithoutOutsideDays: Story = {
  args: {
    mode: 'single',
    showOutsideDays: false,
  },
  render: (args) => <CalendarWithoutOutsideDays {...args} />,
};