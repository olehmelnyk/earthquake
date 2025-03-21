import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// This is a base64 encoded 1x1 pixel PNG
const PLACEHOLDER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    text: 'Click Me',
  },
};

export const WithIcon: Story = {
  args: {
    text: 'With Icon',
    icon: PLACEHOLDER_ICON,
  },
};

export const LongText: Story = {
  args: {
    text: 'Button with a very long text that might wrap',
  },
};