import { FC } from 'react';
import { Badge } from '@earthquake/ui';
import { useMemo } from 'react';

export interface EarthquakeSeverityBadgeProps {
  readonly magnitude: number;
}

export function EarthquakeSeverityBadge({ magnitude }: EarthquakeSeverityBadgeProps) {
  const { severity, variant } = useMemo(() => {
    if (magnitude >= 7) {
      return { severity: 'Major', variant: 'destructive' as const };
    }
    if (magnitude >= 5) {
      return { severity: 'Moderate', variant: 'warning' as const };
    }
    if (magnitude >= 3) {
      return { severity: 'Minor', variant: 'secondary' as const };
    }
    return { severity: 'Micro', variant: 'outline' as const };
  }, [magnitude]);

  return (
    <Badge variant={variant}>{severity}</Badge>
  );
}