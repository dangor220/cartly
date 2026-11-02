import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { buttonStyles, type Variant } from './button-styles';

type ButtonProps = {
  variant?: Variant;
} & ComponentProps<'button'>;

export default function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge(buttonStyles(variant), 'max-w-full whitespace-nowrap', className)}
      {...props}
    />
  );
}
