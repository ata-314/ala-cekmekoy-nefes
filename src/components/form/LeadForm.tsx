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
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 text-champagne">
          ✓
        </span>
        <p className="font-display text-2xl text-cream">{form.success.title}</p>
        <p className="text-sm text-cream/70">{form.success.body}</p>
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
        <label htmlFor={id("name")} className="mb-1.5 block text-xs font-semibold tracking-wide text-cream/80">
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
        <label htmlFor={id("phone")} className="mb-1.5 block text-xs font-semibold tracking-wide text-cream/80">
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
        <label htmlFor={id("email")} className="mb-1.5 block text-xs font-semibold tracking-wide text-cream/80">
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

      <div>
        <label htmlFor={id("unitType")} className="mb-1.5 block text-xs font-semibold tracking-wide text-cream/80">
          {form.fields.unitType.label}
        </label>
        <select
          id={id("unitType")}
          name="unitType"
          defaultValue=""
          className="field"
          aria-invalid={!!errors.unitType}
          aria-describedby={errors.unitType ? id("unitType-error") : undefined}
        >
          <option value="" disabled>
            {form.fields.unitType.placeholder}
          </option>
          {form.unitTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {fieldError("unitType")}
      </div>

      <div>
        <label htmlFor={id("kvkk")} className="flex cursor-pointer items-start gap-2.5">
          <input
            id={id("kvkk")}
            name="kvkk"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a96a]"
            aria-invalid={!!errors.kvkk}
            aria-describedby={errors.kvkk ? id("kvkk-error") : undefined}
          />
          <span className="text-[0.7rem] leading-relaxed text-cream/60">
            <a href={form.kvkk.href} className="underline decoration-champagne/60 underline-offset-2 hover:text-cream">
              {form.kvkk.linkText}
            </a>
            {form.kvkk.label.replace(form.kvkk.linkText, "")}
          </span>
        </label>
        {fieldError("kvkk")}
      </div>

      <button
        type="submit"
        className="cta mt-1 rounded-full bg-champagne px-6 py-3.5 text-sm font-bold tracking-wide text-forest-950"
      >
        {form.submit}
      </button>
    </form>
  );
}
