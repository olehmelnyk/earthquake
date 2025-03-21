import React from 'react';
import Image from 'next/image';

export type ButtonProps = {
  readonly text: string;
  readonly icon?: string;
  readonly onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  onClick
}) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
      onClick={onClick}
    >
      {icon && (
        <Image
          src={icon}
          alt=""
          width={20}
          height={20}
          className="mr-2"
        />
      )}
      <span>{text}</span>
    </button>
  );
};

export default Button;