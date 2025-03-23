import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  useToast,
  ToastProvider,
  ToastViewport
} from '@earthquake/ui';
import { TriangleAlert } from 'lucide-react';

const meta: Meta = {
  title: 'Examples/Warning Components',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const WarningComponents: Story = {
  render: () => {
    const { warning, toast } = useToast();

    return (
      <div className="flex flex-col gap-6 w-full max-w-md">
        <ToastProvider>
          <h2 className="text-2xl font-bold">Warning Components</h2>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Button</h3>
            <div className="flex gap-2 flex-wrap">
              <Button variant="warning">Warning Button</Button>
              <Button variant="warning" size="sm">Small Warning</Button>
              <Button variant="warning" size="lg">Large Warning</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Badge</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="warning">Warning Badge</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alert</h3>
            <Alert variant="warning">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action might have consequences. Please proceed with caution.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Toast</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => {
                  warning({
                    title: "Warning",
                    description: "This action might have consequences"
                  });
                }}
              >
                Show Warning Toast
              </Button>
            </div>
          </div>

          <ToastViewport />
        </ToastProvider>
      </div>
    );
  }
};