import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../../lib/atoms/separator';

const meta: Meta<typeof Separator> = {
  component: Separator,
  title: 'Atoms/Separator',
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <div>Above separator</div>
      <Separator />
      <div>Below separator</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <div>Left of separator</div>
      <Separator orientation="vertical" />
      <div>Right of separator</div>
    </div>
  ),
};

export const WithHeadings: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Main Heading</h2>
      <Separator />
      <div className="grid gap-2">
        <h3 className="font-medium">Subheading 1</h3>
        <p>Some content for the first section.</p>
      </div>
      <Separator className="my-2" />
      <div className="grid gap-2">
        <h3 className="font-medium">Subheading 2</h3>
        <p>Some content for the second section.</p>
      </div>
    </div>
  ),
};