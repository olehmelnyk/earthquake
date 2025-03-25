import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  CardContent
} from '@earthquake/ui';
import {
  earthquakeFormSchema,
  type EarthquakeFormValues as EarthquakeFormValuesType
} from '@earthquake/types';

const formSchema = earthquakeFormSchema;

type EarthquakeFormValues = EarthquakeFormValuesType;

export interface EarthquakeFormProps {
  readonly defaultValues?: Partial<EarthquakeFormValues>;
  readonly onSubmit: (values: EarthquakeFormValues) => Promise<void>;
  readonly isEdit?: boolean;
}

export function EarthquakeForm({
  defaultValues,
  onSubmit,
  isEdit = false
}: EarthquakeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EarthquakeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      magnitude: undefined as unknown as number,
      date: new Date().toISOString(),
      ...defaultValues
    }
  });

  const handleSubmit = async (values: EarthquakeFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      if (!isEdit) {
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const magnitudeValue = form.watch('magnitude');

  // Extract nested ternary into a function
  const getButtonText = () => {
    if (isSubmitting) return 'Saving...';
    return isEdit ? 'Update Earthquake' : 'Add Earthquake';
  };

  const buttonText = getButtonText();

  const magnitudeWarning = useMemo(() => {
    if (!magnitudeValue) return '';

    if (magnitudeValue >= 7) {
      return 'This earthquake is classified as a major earthquake with potentially severe damage.';
    }

    if (magnitudeValue >= 5) {
      return 'This earthquake is classified as a moderate earthquake with potential for damage.';
    }

    return '';
  }, [magnitudeValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div>
                  <Input placeholder="e.g. San Francisco, CA" {...field} />
                </div>
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
              <FormLabel>Magnitude</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.7"
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                    value={field.value ?? ''}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {magnitudeWarning && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="py-3 text-yellow-800 text-sm">
              {magnitudeWarning}
            </CardContent>
          </Card>
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={typeof field.value === 'string'
                      ? field.value.slice(0, 16)
                      : new Date(field.value).toISOString().slice(0, 16)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value ? e.target.value : '');
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}