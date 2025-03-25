import { Edit } from 'lucide-react';
import { Button } from '@earthquake/ui';

export interface EarthquakeEditButtonProps {
  readonly id: string;
  readonly onEdit: (id: string) => void;
}

export const EarthquakeEditButton = ({ id, onEdit }: EarthquakeEditButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => onEdit(id)}
    className="h-8 w-8"
  >
    <Edit className="h-4 w-4" />
    <span className="sr-only">Edit</span>
  </Button>
);