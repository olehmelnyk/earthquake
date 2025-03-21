import { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../lib/atoms/select';

const SelectDemo = (props: React.ComponentProps<typeof Select>) => {
  return (
    <Select {...props}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const meta: Meta<typeof SelectDemo> = {
  title: 'Atoms/Select',
  component: SelectDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    defaultValue: {
      control: 'select',
      options: ['apple', 'banana', 'orange', 'grape', 'pineapple'],
      description: 'The default selected value',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectDemo>;

export const Default: Story = {
  args: {},
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'apple',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};