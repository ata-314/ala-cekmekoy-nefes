"use client";

import { useState } from "react";
import { form } from "@/content/project";

type Errors = Partial<Record<"name" | "phone" | "email" | "unitType" | "kvkk", string>>;

/**
 * Lead-capture form. Validation is client-side; submission is intentionally
 * stubbed — no endpoint has been provided yet (see README "Form verisi nereye
 * gidiyor?"). It never claims data left the browser.
 */
export default function LeadForm({ idPrefix }: { idPrefix: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const id = (field: string) => `${idPrefix}-${field}`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/[\s()-]/g, "");
    const email = String(data.get("email") ?? "").trim();
    const unitType = String(data.get("unitType") ?? "");

    if (name.length < 3 || !name.includes(" ")) next.name = form.errors.name;
    if (!/^(\+90|0)?5\d{9}$/.test(phone)) next.phone = form.errors.phone;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = form.errors.email;
    if (!unitType) next.unitType = form.errors.unitType;
    if (!data.get("kvkk")) next.kvkk = form.errors.kvkk;

    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO(human): wire to the real lead endpoint / CRM when provided.
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="flex flex-col items-start gap-2 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
          ✓
        </span>
        <p className="font-display text-2xl text-snow">{form.success.title}</p>
        <p className="text-sm text-snow/70">{form.success.body}</p>
      </div>
    );
  }

  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} role="alert" className="mt-1 text-xs text-[#e07a5f]">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor={id("name")} className="mb-1.5 block text-xs font-semibold tracking-wide text-snow/80">
          {form.fields.name.label}
        </label>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          placeholder={form.fields.name.placeholder}
          className="field"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? id("name-error") : undefined}
        />
        {fieldError("name")}
      </div>

      <div>
        <label htmlFor={id("phone")} className="mb-1.5 block text-xs font-semibold tracking-wide text-snow/80">
          {form.fields.phone.label}
        </label>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={form.fields.phone.placeholder}
          className="field"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? id("phone-error") : undefined}
        />
        {fieldError("phone")}
      </div>

      <div>
        <label htmlFor={id("email")} className="mb-1.5 block text-xs font-semibold tracking-wide text-snow/80">
          {form.fields.email.label}
        </label>
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={form.fields.email.placeholder}
          className="field"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? id("email-error") : undefined}
        />
        {fieldError("email")}
      </div>

      <fieldset>
        <legend className="mb-2 block text-xs font-semibold tracking-wide text-snow/80">
          {form.fields.unitType.label}
        </legend>
        <div
          className="flex flex-wrap gap-2"
          aria-describedby={errors.unitType ? id("unitType-error") : undefined}
        >
          {form.unitTypes.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="unitType"
                value={t}
                className="peer sr-only"
              />
              <span className="block rounded-full border border-snow/20 bg-obsidian-950/35 px-4 py-2 text-xs font-semibold text-snow/70 transition-all duration-300 hover:border-snow/45 peer-checked:border-accent/80 peer-checked:bg-accent/15 peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {t}
              </span>
            </label>
          ))}
        </div>
        {fieldError("unitType")}
      </fieldset>

      <div>
        <label htmlFor={id("kvkk")} className="flex cursor-pointer items-start gap-2.5">
          <input
            id={id("kvkk")}
            name="kvkk"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffffff]"
            aria-invalid={!!errors.kvkk}
            aria-describedby={errors.kvkk ? id("kvkk-error") : undefined}
          />
          <span className="text-[0.7rem] leading-relaxed text-snow/60">
            <a href={form.kvkk.href} className="underline decoration-accent/60 underline-offset-2 hover:text-snow">
              {form.kvkk.linkText}
            </a>
            {form.kvkk.label.replace(form.kvkk.linkText, "")}
          </span>
        </label>
        {fieldError("kvkk")}
      </div>

      <button
        type="submit"
        className="cta group mt-1 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold tracking-wide text-obsidian-950"
      >
        {form.submit}
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>
      <p className="text-center text-[0.65rem] leading-relaxed text-snow/45">
        {form.privacyNote}
      </p>
    </form>
  );
}
