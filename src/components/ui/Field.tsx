import React from 'react';
import { classNames } from '../../utils/format';

const baseControl =
'w-full rounded-xl border-2 border-ink bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-smoke/70 focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-1 focus:ring-offset-paper transition-shadow';

export function Label({ children, htmlFor }: {children: React.ReactNode;htmlFor?: string;}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-smoke">
      {children}
    </label>);

}

export function Field({
  label,
  children,
  className




}: {label: string;children: React.ReactNode;className?: string;}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>);

}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) =>
  <input ref={ref} className={classNames(baseControl, className)} {...rest} />

);
Input.displayName = 'Input';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...rest }, ref) =>
  <select ref={ref} className={classNames(baseControl, 'appearance-none cursor-pointer', className)} {...rest}>
    {children}
  </select>
);
Select.displayName = 'Select';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) =>
  <textarea ref={ref} className={classNames(baseControl, 'min-h-[90px] resize-y', className)} {...rest} />
);
Textarea.displayName = 'Textarea';