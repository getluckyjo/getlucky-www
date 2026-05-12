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
        className="block text-xs font-semibold uppercase tracking-widest text-green-dark/70 mb-2"
      >
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <span id={hintId} className="block mt-1.5 text-xs text-charcoal-light/70">{hint}</span>
      )}
      {error && (
        <span id={errorId} className="block mt-1.5 text-xs text-red-600 font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

const inputBase =
  "w-full bg-white border border-green-dark/15 rounded-xl px-4 py-3.5 text-base text-foreground placeholder:text-charcoal-light/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all";

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
          className="mt-1 w-5 h-5 rounded border-green-dark/30 text-green focus:ring-gold/30 focus:ring-2 cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-charcoal-light/90 leading-relaxed">{children}</span>
      </label>
      {error && (
        <span className="block mt-1.5 ml-8 text-xs text-red-600 font-medium">{error}</span>
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
            className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-green-dark/15 bg-white hover:border-gold/50 has-[:checked]:border-gold has-[:checked]:bg-gold/5 has-[:checked]:ring-2 has-[:checked]:ring-gold/30 transition-all"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              defaultChecked={o.value === defaultValue}
              className="mt-1 w-5 h-5 text-green focus:ring-gold/30 focus:ring-2 cursor-pointer flex-shrink-0"
            />
            <div>
              <span className="block text-sm font-semibold text-green-dark">{o.label}</span>
              {o.sublabel && (
                <span className="block text-xs text-charcoal-light/70 mt-0.5">{o.sublabel}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <span className="block mt-1.5 text-xs text-red-600 font-medium">{error}</span>
      )}
    </div>
  );
}

export function SubmitButton({
  pending,
  children = "Submit",
}: {
  pending?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-green hover:bg-green-light disabled:bg-green/50 disabled:cursor-not-allowed text-cream font-semibold text-base px-10 py-4 rounded-full transition-all hover:scale-[1.02] active:scale-[0.99] inline-flex items-center justify-center gap-2"
    >
      {pending && (
        <svg
          className="animate-spin -ml-1 h-4 w-4"
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
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
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
    <div className="rounded-2xl bg-green/5 border border-green/20 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-green text-cream mx-auto flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-heading text-2xl text-green-dark uppercase tracking-wide mb-2">{title}</h3>
      <p className="text-sm text-charcoal-light/80 max-w-md mx-auto leading-relaxed">{body}</p>
    </div>
  );
}

export type { FieldErrors };
