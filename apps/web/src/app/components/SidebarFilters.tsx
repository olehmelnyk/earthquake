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
  Input,
  Slider,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  earthquakeFilterSchema,
  type EarthquakeFilterValues
} from '@earthquake/ui';

interface SidebarFiltersProps {
  readonly onFilterChange: (filters: EarthquakeFilterValues) => void;
  readonly initialFilters?: EarthquakeFilterValues;
}

export const SidebarFilters: FC<SidebarFiltersProps> = ({
  onFilterChange,
  initialFilters
}) => {
  const defaultValues: EarthquakeFilterValues = {
    location: '',
    magnitudeFrom: 0,
    magnitudeTo: 10,
    dateFrom: '',
    dateTo: '',
  };

  const form = useForm<EarthquakeFilterValues>({
    resolver: zodResolver(earthquakeFilterSchema),
    defaultValues: initialFilters || defaultValues,
  });

  // Update form values when initialFilters change (from URL)
  useEffect(() => {
    if (initialFilters) {
      Object.entries(initialFilters).forEach(([key, value]) => {
        form.setValue(key as keyof EarthquakeFilterValues, value);
      });
    }
  }, [form, initialFilters]);

  function onSubmit(data: EarthquakeFilterValues) {
    onFilterChange(data);
  }

  const resetFilters = () => {
    form.reset(defaultValues);
    onFilterChange(defaultValues);
  };

  return (
    <div className="w-72 p-4 bg-card/50 border-r border-border h-screen shrink-0 overflow-y-auto">
      <Card className="shadow-none border-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Form methods={form} onSubmit={onSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 34.0522, -118.2437"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Magnitude Range</FormLabel>
              <div className="pt-5">
                <FormField
                  control={form.control}
                  name="magnitudeFrom"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Slider
                          min={0}
                          max={10}
                          step={0.1}
                          value={[
                            Number(field.value) || 0,
                            Number(form.getValues('magnitudeTo')) || 10,
                          ]}
                          onValueChange={(values: number[]) => {
                            field.onChange(values[0]);
                            form.setValue('magnitudeTo', values[1]);
                          }}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>{form.watch('magnitudeFrom').toFixed(1)}</div>
                <div>{form.watch('magnitudeTo').toFixed(1)}</div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="dateFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date From</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date To</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" variant="default" className="w-full">
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
