import type { Meta, StoryObj } from '@storybook/react';
import { NextImage } from './NextImage';

// Use a colored placeholder image instead of a transparent pixel
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22150%22%3E%3Crect%20width%3D%22200%22%20height%3D%22150%22%20fill%3D%22%2366f%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%2275%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22white%22%3EIMAGE%3C%2Ftext%3E%3C%2Fsvg%3E';

const meta: Meta<typeof NextImage> = {
  component: NextImage,
  title: 'Components/NextImage',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NextImage>;

export const Default: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: 'Placeholder image',
    width: 300,
    height: 200,
  },
};

export const Small: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: 'Small placeholder image',
    width: 150,
    height: 100,
  },
};