// Mock modules that use React hooks to avoid errors in tests
jest.mock('@earthquake/ui', () => {
  const originalModule = jest.requireActual('@earthquake/ui');

  return {
    __esModule: true,
    ...originalModule,
    // Mock the useToast hook to return needed functions without calling React hooks
    useToast: () => ({
      toast: jest.fn(),
      toasts: [],
      dismiss: jest.fn(),
    }),
    // Mock the Toaster component to return null
    Toaster: () => null,
  };
});