import type { Meta, StoryObj } from '@storybook/react';
import { NextLink } from './NextLink';

const meta: Meta<typeof NextLink> = {
  component: NextLink,
  title: 'Components/NextLink',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NextLink>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    children: 'Click me',
  },
};

export const WithCustomClass: Story = {
  args: {
    href: 'https://example.com',
    children: 'Custom styled link',
    className: 'font-bold text-lg',
  },
};