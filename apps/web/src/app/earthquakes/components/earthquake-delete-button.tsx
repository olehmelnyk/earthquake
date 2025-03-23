import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@earthquake/ui';

export interface EarthquakeDeleteButtonProps {
  readonly id: string;
  readonly location: string;
  readonly onDelete: (id: string) => Promise<void>;
}

export function EarthquakeDeleteButton({
  id,
  location,
  onDelete
}: EarthquakeDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(id);
      success({ title: 'Success', description: `Earthquake record for ${location} was deleted.` });
    } catch (err) {
      console.error('Failed to delete earthquake:', err);
      error({
        title: 'Error',
        description: 'Failed to delete earthquake record. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="warning" size="sm">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the earthquake record for <strong>{location}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-warning text-warning-foreground hover:bg-warning/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}