'use client';

import React, { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
  CardContent,
  Separator,
  DateTimePicker
} from '@earthquake/ui';
import { type Earthquake } from './EarthquakeTable';
import {
  type EarthquakeFormValues,
  earthquakeFormSchema
} from '@earthquake/types';

interface EarthquakeFormProps {
  earthquake?: Earthquake;
  onSubmit: (data: EarthquakeFormValues) => void;
  onCancel: () => void;
}

export const EarthquakeForm: FC<EarthquakeFormProps> = ({
  earthquake,
  onSubmit,
  onCancel
}) => {
  const form = useForm<EarthquakeFormValues>({
    resolver: zodResolver(earthquakeFormSchema),
    defaultValues: {
      location: '',
      magnitude: 0,
      date: dayjs().format('YYYY-MM-DDTHH:mm'), // Use dayjs to format current date/time
    },
    mode: 'onBlur',
  });

  // Format date with current time for the input
  const formatDateWithTime = (dateString: string): string => {
    const date = dayjs(dateString);
    return date.isValid()
      ? date.format('YYYY-MM-DDTHH:mm') // YYYY-MM-DDThh:mm format
      : dayjs().format('YYYY-MM-DDTHH:mm'); // Default to current date/time if invalid
  };

  // Set form values when editing an existing earthquake
  useEffect(() => {
    if (earthquake) {
      form.reset({
        location: earthquake.location,
        magnitude: earthquake.magnitude,
        date: formatDateWithTime(earthquake.date),
      });
    }
  }, [earthquake, form]);

  const handleSubmit = (data: EarthquakeFormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Form methods={form} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Location (lat, long)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 34.0522, -118.2437"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="magnitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Magnitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="e.g. 5.5"
                      className="bg-background"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Date and Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {earthquake ? 'Update' : 'Add'} Earthquake
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};