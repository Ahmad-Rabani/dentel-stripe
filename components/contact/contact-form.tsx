"use client";

import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useActionState, type ReactNode } from "react";

const initialState: ContactState = {
  status: "idle",
  message: "",
};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "h-12 rounded-xl border border-line bg-surface px-4 text-sm outline-none transition-colors focus:border-forest";

export function ContactForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(sendContactMessage, initialState);

  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id="name" label="Name" error={state.fieldErrors?.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
        />
      </Field>
      <Field id="email" label="Email" error={state.fieldErrors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
        />
      </Field>
      <Field id="phone" label="Phone (optional)" error={state.fieldErrors?.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors?.phone)}
          aria-describedby={state.fieldErrors?.phone ? "phone-error" : undefined}
        />
      </Field>
      <Field id="message" label="How can we help?" error={state.fieldErrors?.message}>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={6}
          className={cn(inputClass, "h-auto py-3")}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
        />
      </Field>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send message"}
      </Button>
      {state.message ? (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-sm leading-6",
            state.status === "success" ? "text-forest" : "text-muted",
          )}
        >
          {state.message}{" "}
          {state.status === "error" ? (
            <a href={`mailto:${email}`} className="underline decoration-brass underline-offset-4">
              {email}
            </a>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
