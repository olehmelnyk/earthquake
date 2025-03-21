# UI Package

A shared UI component library that uses Next.js components and is compatible with the Next.js application in the monorepo.

## Features

- Built with Next.js components
- Components can use Next.js specific features like Image and Link
- Includes Storybook for component development and testing
- Uses Tailwind CSS for styling

## Usage

To use components from this library:

```tsx
import { Button } from '@earthquake/ui';

export default function MyComponent() {
  return (
    <Button
      text="Click Me"
      onClick={() => console.log('Button clicked')}
    />
  );
}
```

## Storybook

To run Storybook:

```bash
pnpm dev:storybook
```

## Building the package

```bash
nx build ui
```

## Running unit tests

Run `nx test ui` to execute the unit tests via [Vitest](https://vitest.dev/).
