import React from 'react';
import { Alert, AlertDescription } from './alert';
import { TriangleAlert } from 'lucide-react';

export interface ValidationWarningProps {
  readonly message: string;
}

export function ValidationWarning({ message }: ValidationWarningProps) {
  if (!message) return null;

  return (
    <Alert variant="warning" className="mb-4">
      <TriangleAlert className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}