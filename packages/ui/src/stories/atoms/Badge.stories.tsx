import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../lib/atoms/badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const WithNumber: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>1</Badge>
      <Badge variant="secondary">2</Badge>
      <Badge variant="destructive">3</Badge>
      <Badge variant="outline">4</Badge>
      <Badge variant="warning">5</Badge>
    </div>
  ),
};