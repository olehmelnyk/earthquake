import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../lib/atoms/button';
import { Toast, ToastAction } from '../../lib/molecules/toast';
import { Toaster } from '../../lib/molecules/toaster';
import { useToast } from '../../lib/hooks/use-toast';

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Default Toast',
            description: 'This is a toast message',
          });
        }}
      >
        Show Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast({
            variant: 'destructive',
            title: 'Error Toast',
            description: 'There was an error with your request',
          });
        }}
      >
        Show Error Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Toast with Action',
            description: 'This toast has an action button',
            action: (
              <ToastAction altText="Try again" onClick={() => alert('Action clicked')}>
                Try again
              </ToastAction>
            ),
          });
        }}
      >
        Show Toast with Action
      </Button>

      <Toaster />
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: 'Molecules/Toast',
  component: ToastDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {};