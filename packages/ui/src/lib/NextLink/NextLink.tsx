import React from 'react';
import Link from 'next/link';

export type NextLinkProps = {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly className?: string;
};

export const NextLink: React.FC<NextLinkProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <Link
      href={href}
      className={`text-blue-600 hover:text-blue-800 hover:underline ${className ?? ''}`}
    >
      {children}
    </Link>
  );
};

export default NextLink;