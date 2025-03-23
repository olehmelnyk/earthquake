import { Edit } from 'lucide-react';
import { Button } from '@earthquake/ui';

export const EarthquakeEditButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="h-8 w-8"
  >
    <Edit className="h-4 w-4" />
    <span className="sr-only">Edit</span>
  </Button>
);