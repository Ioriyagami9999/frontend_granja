import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-600 via-sky-600 to-accent-600 hover:from-brand-700 hover:via-sky-700 hover:to-accent-700 text-white focus-visible:outline-brand-700',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus-visible:outline-slate-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:outline-red-700',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  large?: boolean;
}

export function Button({ variant = 'primary', large = false, className = '', ...props }: ButtonProps) {
  const sizeClasses = large ? 'px-6 py-4 text-lg tap-target' : 'px-4 py-2 text-sm tap-target';
  return (
    <button
      className={`${sizeClasses} rounded-lg font-medium shadow-sm transition-all duration-150 ease-out hover:shadow-md active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:grayscale disabled:opacity-60 disabled:shadow-none disabled:active:scale-100 disabled:hover:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
