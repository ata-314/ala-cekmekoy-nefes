import { form } from "@/content/project";
import LeadForm from "./LeadForm";

/**
 * Desktop-only fixed lead panel — always reachable on the left edge,
 * independently scrollable if taller than the viewport.
 */
export default function LeadPanel() {
  return (
    <aside
      aria-label={form.title}
      className="fixed left-6 top-1/2 z-30 hidden w-[350px] -translate-y-1/2 lg:block xl:left-10 xl:w-[380px]"
    >
      <div className="glass max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl p-7 xl:p-8">
        <h2 className="font-display text-3xl text-cream">{form.title}</h2>
        <p className="mb-6 mt-1 text-sm text-cream/65">{form.sub}</p>
        <LeadForm idPrefix="desktop" />
      </div>
    </aside>
  );
}
