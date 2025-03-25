import { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../lib/atoms/calendar';
import { useState } from 'react';
import { addDays } from 'date-fns';
import type { DateRange } from '../../lib/types';

type CalendarProps = React.ComponentProps<typeof Calendar>;

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
const SingleCalendar = (props: CalendarProps) => {
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
const MultipleCalendar = (props: CalendarProps) => {
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
const RangeCalendar = (props: CalendarProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  return (
    <div className="border rounded-md">
      <Calendar
        {...props}
        mode="range"
        selected={dateRange}
        onSelect={(range: DateRange | undefined) => {
          if (range && 'from' in range) {
            setDateRange(range);
          }
        }}
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
export const WithoutOutsideDays: Story = {
  args: {
    mode: 'single',
    showOutsideDays: false,
  },
  render: (args) => <SingleCalendar {...args} />,
};