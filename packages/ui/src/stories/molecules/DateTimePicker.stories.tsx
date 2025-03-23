import { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from '../../lib/molecules/date-time-picker';
import { useState } from 'react';
import React from 'react';

const meta: Meta<typeof DateTimePicker> = {
  title: 'Molecules/DateTimePicker',
  component: DateTimePicker,
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
      description: 'The selected date and time value',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

// Basic date-time picker
const DefaultDateTimePicker = (props: any) => {
  const [date, setDate] = useState<Date | string | undefined>(undefined);
  return (
    <div style={{ width: '300px' }}>
      <DateTimePicker
        {...props}
        value={date}
        onChange={(newDate) => setDate(newDate)}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    placeholder: 'Select date and time',
    clearable: true,
  },
  render: (args) => <DefaultDateTimePicker {...args} />,
};

// With pre-selected date and time
const PreSelectedDateTimePicker = (props: any) => {
  const [date, setDate] = useState<Date | string | undefined>(new Date());
  return (
    <div style={{ width: '300px' }}>
      <DateTimePicker
        {...props}
        value={date}
        onChange={(newDate) => setDate(newDate)}
      />
    </div>
  );
};

export const WithSelectedDateTime: Story = {
  args: {
    placeholder: 'Select date and time',
    clearable: true,
  },
  render: (args) => <PreSelectedDateTimePicker {...args} />,
};

// Without clear button
const NonClearableDateTimePicker = (props: any) => {
  const [date, setDate] = useState<Date | string | undefined>(undefined);
  return (
    <div style={{ width: '300px' }}>
      <DateTimePicker
        {...props}
        value={date}
        onChange={(newDate) => setDate(newDate)}
      />
    </div>
  );
};

export const WithoutClearButton: Story = {
  args: {
    placeholder: 'Select date and time',
    clearable: false,
  },
  render: (args) => <NonClearableDateTimePicker {...args} />,
};

// With custom styling
const CustomStyledDateTimePicker = (props: any) => {
  const [date, setDate] = useState<Date | string | undefined>(undefined);
  return (
    <div style={{ width: '300px' }}>
      <DateTimePicker
        {...props}
        value={date}
        onChange={(newDate) => setDate(newDate)}
      />
    </div>
  );
};

export const CustomStyling: Story = {
  args: {
    placeholder: 'Custom date and time',
    clearable: true,
    className: 'border-2 border-primary rounded-xl',
  },
  render: (args) => <CustomStyledDateTimePicker {...args} />,
};