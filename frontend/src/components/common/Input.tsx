import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={[
          'rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
          error ? 'border-red-400' : 'border-stone-300',
          className,
        ].join(' ')}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
