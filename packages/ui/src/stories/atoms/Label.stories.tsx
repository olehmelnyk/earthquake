import { Meta, StoryObj } from '@storybook/react';
import { Label } from '../../lib/atoms/label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'The ID of the element the label is for',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const WithHtmlFor: Story = {
  args: {
    children: 'Email',
    htmlFor: 'email',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} />
      <input
        type="email"
        id="email"
        placeholder="Email"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  ),
};

export const Required: Story = {
  args: {
    children: 'Required Field',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args}>
        {args.children} <span className="text-destructive">*</span>
      </Label>
      <input
        type="text"
        placeholder="Required field"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  ),
};

export const Muted: Story = {
  args: {
    children: 'Muted Label',
  },
  render: (args) => (
    <Label {...args} className="text-muted-foreground">
      {args.children}
    </Label>
  ),
};