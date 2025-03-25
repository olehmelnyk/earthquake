import { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '../../lib/molecules/date-picker';
import React, { useState } from 'react';

// Type alias for the date value
type DateValue = Date | string | undefined;
type DatePickerProps = React.ComponentProps<typeof DatePicker>;

const meta: Meta<typeof DatePicker> = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    clearable: {
      control: 'boolean',
      description: 'Whether to show a clear button',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    value: {
      control: 'date',
      description: 'The selected date value',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Basic date picker
const DefaultDatePicker = (props: DatePickerProps) => {
  const [date, setDate] = useState<DateValue>(undefined);
  return (
    <div style={{ width: '300px' }}>
      <DatePicker
        {...props}
        value={date}
        onChange={(newDate) => setDate(newDate)}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    placeholder: 'Select date',
    clearable: true,
  },
  render: (args) => <DefaultDatePicker {...args} />,
};

// With pre-selected date
const PreSelectedDatePicker = (props: DatePickerProps) => {
  const [date, setDate] = useState<DateValue>(new Date());
  return (
    <div style={{ width: '300px' }}>
      <DatePicker
        {...props}
        value={date}
        onChange={(newDate) => setDate(newDate)}
      />
    </div>
  );
};

export const WithSelectedDate: Story = {
  args: {
    placeholder: 'Select date',
    clearable: true,
  },
  render: (args) => <PreSelectedDatePicker {...args} />,
};

// Without clear button
export const WithoutClearButton: Story = {
  args: {
    placeholder: 'Select date',
    clearable: false,
  },
  render: (args) => <DefaultDatePicker {...args} />,
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    placeholder: 'Select custom date',
    clearable: true,
    className: 'border-2 border-primary rounded-xl',
  },
  render: (args) => <DefaultDatePicker {...args} />,
};