import { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../../lib/atoms/slider';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: { type: 'number' },
      description: 'The minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'The maximum value',
    },
    step: {
      control: { type: 'number' },
      description: 'The step value',
    },
    defaultValue: {
      control: 'object',
      description: 'The default value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      description: 'The orientation of the slider',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '300px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: "w-[300px]",
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: "w-[300px]",
  },
};

export const SmallStep: Story = {
  args: {
    defaultValue: [0.5],
    max: 1,
    step: 0.1,
    className: "w-[300px]",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    disabled: true,
    className: "w-[300px]",
  },
};

// Define a React component for the WithLabels story
const SliderWithLabels = (args: React.ComponentProps<typeof Slider>) => {
  const [value, setValue] = useState(args.defaultValue);
  return (
    <div className="space-y-6">
      <Slider
        {...args}
        value={value}
        onValueChange={setValue}
        className="w-full"
      />
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Min: {args.min || 0}</span>
        <span className="text-sm font-medium">Value: {value}</span>
        <span className="text-sm text-muted-foreground">Max: {args.max}</span>
      </div>
    </div>
  );
};

export const WithLabels: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
  },
  render: (args) => <SliderWithLabels {...args} />,
};

export const Vertical: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    orientation: 'vertical',
  },
  render: (args) => (
    <div style={{ height: '200px', width: '50px' }} className="flex items-center justify-center">
      <Slider {...args} className="h-full" />
    </div>
  ),
};

export const SliderShowcase: Story = {
  render: () => (
    <div className="space-y-10 w-full max-w-[500px]">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default Slider</h3>
        <Slider defaultValue={[50]} max={100} className="w-full" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Range Slider</h3>
        <Slider defaultValue={[25, 75]} max={100} className="w-full" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Disabled Slider</h3>
        <Slider defaultValue={[30]} max={100} disabled className="w-full" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Vertical Slider</h3>
        <div style={{ height: '150px', width: '50px' }} className="flex items-center justify-center">
          <Slider orientation="vertical" defaultValue={[60]} max={100} className="h-full" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Multi-range Vertical Slider</h3>
        <div style={{ height: '150px', width: '50px' }} className="flex items-center justify-center">
          <Slider orientation="vertical" defaultValue={[20, 80]} max={100} className="h-full" />
        </div>
      </div>
    </div>
  ),
};