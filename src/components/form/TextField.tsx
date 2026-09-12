import type { ComponentType } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextFieldProps {
  label: string;
  type?: string;
  step?: string;
  placeholder?: string;
  autoFocus?: boolean;
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  registration: UseFormRegisterReturn;
  error?: string;
}

export function TextField({
  label,
  type = 'text',
  step,
  placeholder,
  autoFocus,
  icon: Icon,
  registration,
  error,
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={registration.name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-1">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          id={registration.name}
          type={type}
          step={step}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${registration.name}-error` : undefined}
          className={`w-full rounded-lg border bg-white py-2 text-sm text-slate-900 shadow-sm transition-shadow focus:outline-none focus:ring-2 ${Icon ? 'pl-9 pr-3' : 'px-3'} ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
              : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/30'
          }`}
          {...registration}
        />
      </div>
      {error && (
        <p id={`${registration.name}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
