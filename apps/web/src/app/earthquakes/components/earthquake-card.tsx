import { FC } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@earthquake/ui';
import { Earthquake } from '../../components/EarthquakeTable';
import { EarthquakeSeverityBadge } from './earthquake-severity-badge';
import { EarthquakeEditButton } from './earthquake-edit-button';
import { EarthquakeDeleteButton } from './earthquake-delete-button';
import dayjs from 'dayjs';
import { formatDistance } from 'date-fns';

export interface EarthquakeCardProps {
  readonly id: string;
  readonly location: string;
  readonly magnitude: number;
  readonly date: Date;
  readonly onDelete: (id: string) => Promise<void>;
  readonly onEdit: (id: string) => void;
}

export function EarthquakeCard({
  id,
  location,
  magnitude,
  date,
  onDelete,
  onEdit
}: EarthquakeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            {location}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <EarthquakeSeverityBadge magnitude={magnitude} />
            <span className="text-xs text-muted-foreground">
              {formatDistance(date, new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid="magnitude">{magnitude.toFixed(1)}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {date.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <EarthquakeEditButton id={id} onEdit={onEdit} />
        <EarthquakeDeleteButton
          id={id}
          location={location}
          onDelete={onDelete}
        />
      </CardFooter>
    </Card>
  );
}