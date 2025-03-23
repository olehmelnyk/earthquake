// This file fixes TypeScript errors between React 19 and our UI components

// Use //@ts-nocheck at the top of your component files to ignore component type errors
// This is a workaround for React 19 compatibility issues with the UI components

// Export utility types for React components
export type ComponentWithAny<T> = T extends React.ComponentType<infer P>
  ? React.ComponentType<P & { [key: string]: unknown }>
  : never;

// Export types for onValueChange handlers
export type SliderValueChangeHandler = (values: number[]) => void;