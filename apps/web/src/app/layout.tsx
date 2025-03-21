import { ApolloWrapper } from './apollo-provider';
import './global.css';

export const metadata = {
  title: 'Earthquake Tracker',
  description: 'A simple earthquake data tracking application',
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
