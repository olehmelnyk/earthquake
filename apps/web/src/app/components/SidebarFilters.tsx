'use client';

import React, { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Badge,
  Separator,
  DatePicker
} from '@earthquake/ui';
import {
  earthquakeFilterSchema,
  type EarthquakeFilterValues
} from '@earthquake/types';

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
    defaultValues: initialFilters ?? defaultValues,
  });

  // Update form values when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      Object.entries(initialFilters).forEach(([key, value]) => {
        form.setValue(key as keyof EarthquakeFilterValues, value);
      });
    }
  }, [initialFilters, form]);

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    const values = form.getValues();
    let count = 0;

    if (values.location) count++;
    if (values?.magnitudeFrom && values.magnitudeFrom > 0) count++;
    if (values?.magnitudeTo && values.magnitudeTo < 10) count++;
    if (values.dateFrom) count++;
    if (values.dateTo) count++;

    return count;
  }, [form]);

  function onSubmit(data: EarthquakeFilterValues) {
    onFilterChange(data);
  }

  const resetFilters = () => {
    form.reset(defaultValues);
    onFilterChange(defaultValues);
  };

  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form methods={form} onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Search by location..."
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Magnitude Range</h3>
              <div className="pt-4">
                <FormField
                  control={form.control}
                  name="magnitudeFrom"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormControl>
                        <Slider
                          min={0}
                          max={10}
                          step={0.1}
                          value={[
                            Number(field.value) || 0,
                            Number(form.getValues('magnitudeTo')) || defaultValues.magnitudeTo,
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
              <div className="flex justify-between text-xs">
                <div className="bg-muted py-1 px-2 rounded-md">
                  Min: <span className="font-medium">{(form.watch('magnitudeFrom') || 0).toFixed(1)}</span>
                </div>
                <div className="bg-muted py-1 px-2 rounded-md">
                  Max: <span className="font-medium">{(form.watch('magnitudeTo') || defaultValues.magnitudeTo).toFixed(1)}</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Date Range</h3>

              <FormField
                control={form.control}
                name="dateFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">From</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full bg-background"
                        clearable={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">To</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full bg-background"
                        clearable={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={!form.formState.isDirty}
              >
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
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