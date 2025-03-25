import { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from '../../lib/molecules/date-time-picker';
import { useState } from 'react';

// Type alias for date value
type DateTimeValue = Date | string | undefined;
type DateTimePickerProps = React.ComponentProps<typeof DateTimePicker>;

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
const DefaultDateTimePicker = (props: DateTimePickerProps) => {
  const [date, setDate] = useState<DateTimeValue>(undefined);
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
const PreSelectedDateTimePicker = (props: DateTimePickerProps) => {
  const [date, setDate] = useState<DateTimeValue>(new Date());
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
export const WithoutClearButton: Story = {
  args: {
    placeholder: 'Select date and time',
    clearable: false,
  },
  render: (args) => <DefaultDateTimePicker {...args} />,
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    placeholder: 'Custom date and time',
    clearable: true,
    className: 'border-2 border-primary rounded-xl',
  },
  render: (args) => <DefaultDateTimePicker {...args} />,
};