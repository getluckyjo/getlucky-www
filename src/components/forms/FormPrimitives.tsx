"use client";

import { ReactNode } from "react";

type FieldErrors = Record<string, string | undefined>;

export function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint && !error ? `${name}-hint` : undefined;
  return (
    <div className="block">
      <label
        htmlFor={name}
        className="block text-[11px] font-bold uppercase tracking-[0.1em] text-green/70 mb-2"
      >
        {label}
        {required && <span className="text-green ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <span id={hintId} className="block mt-1.5 text-xs text-green/60">{hint}</span>
      )}
      {error && (
        <span id={errorId} className="block mt-1.5 text-xs text-red font-semibold" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// The app's field: white (or the surface, on a white card), a 2px transparent
// border that turns brand green on focus, green text. See `.field` in globals.css.
const inputBase = "field";

export function Input({
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  autoComplete,
  inputMode,
}: {
  name: string;
  type?: "text" | "email" | "tel" | "date" | "url";
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className={inputBase}
    />
  );
}

export function Textarea({
  name,
  placeholder,
  rows = 4,
  required,
  value,
  defaultValue,
  onChange,
}: {
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      rows={rows}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={inputBase}
    />
  );
}

export function Select({
  name,
  required,
  options,
  defaultValue,
  placeholder,
}: {
  name: string;
  required?: boolean;
  options: readonly string[] | readonly { value: string; label: string }[];
  defaultValue?: string;
  placeholder?: string;
}) {
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <select
      id={name}
      name={name}
      required={required}
      defaultValue={defaultValue ?? ""}
      className={inputBase}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({
  name,
  required,
  children,
  error,
}: {
  name: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="block">
      <label htmlFor={name} className="flex items-start gap-3 cursor-pointer group">
        <input
          id={name}
          name={name}
          type="checkbox"
          required={required}
          className="mt-1 w-5 h-5 rounded border-bar-off accent-green cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-green/90 leading-relaxed">{children}</span>
      </label>
      {error && (
        <span className="block mt-1.5 ml-8 text-xs text-red font-semibold">{error}</span>
      )}
    </div>
  );
}

export function RadioGroup({
  name,
  options,
  required,
  defaultValue,
  layout = "stack",
  error,
}: {
  name: string;
  options: { value: string; label: string; sublabel?: string }[];
  required?: boolean;
  defaultValue?: string;
  layout?: "stack" | "row";
  error?: string;
}) {
  return (
    <div>
      <div className={layout === "row" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-2.5"}>
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 border-transparent bg-white shadow-[0_2px_10px_rgba(52,82,49,0.06)] hover:border-bar-off has-[:checked]:border-green transition-colors"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              defaultChecked={o.value === defaultValue}
              className="mt-1 w-5 h-5 accent-green cursor-pointer flex-shrink-0"
            />
            <div>
              <span className="block text-sm font-semibold text-green">{o.label}</span>
              {o.sublabel && (
                <span className="block text-xs text-green/70 mt-0.5">{o.sublabel}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <span className="block mt-1.5 text-xs text-red font-semibold">{error}</span>
      )}
    </div>
  );
}

export function SubmitButton({
  pending,
  disabled,
  children = "Submit",
}: {
  pending?: boolean;
  /**
   * Locked without the spinner — for a form with a second action in flight
   * (the R100 button on the PGA show form), where the spinner belongs to the
   * other button and showing it here would claim this one is working.
   */
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-lime w-full sm:w-auto"
    >
      {pending && (
        <svg
          className="animate-spin -ml-1 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function FormErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-white border-l-4 border-red px-4 py-3 text-sm text-green" role="alert">
      {message}
    </div>
  );
}

export function FormSuccessCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="card--dark p-8 text-center fade-up">
      <div className="icon-disc mx-auto mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-heading text-2xl text-white mb-2">{title}</h3>
      <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">{body}</p>
    </div>
  );
}

export type { FieldErrors };
