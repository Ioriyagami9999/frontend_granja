import type { ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface SelectFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  children: ReactNode;
  disabled?: boolean;
}

export function SelectField({ label, registration, error, children, disabled }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={registration.name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={registration.name}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${registration.name}-error` : undefined}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
            : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/30'
        }`}
        {...registration}
      >
        {children}
      </select>
      {error && (
        <p id={`${registration.name}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
