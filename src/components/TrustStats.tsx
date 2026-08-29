import { STATS } from "@/lib/constants";
import { Reveal } from "./Reveal";

const items = [
  { value: STATS.lessonsTaught, label: STATS.lessonsLabel },
  { value: STATS.experienceValue, label: STATS.experienceLabel },
  { value: STATS.audienceValue, label: STATS.audienceLabel },
  { value: STATS.reachValue, label: STATS.reachLabel },
];

export function TrustStats() {
  return (
    <section aria-label="Credibilità" className="pb-4 md:pb-6">
      <div className="container-page">
        <Reveal>
          <div className="card-surface grid grid-cols-2 gap-px overflow-hidden bg-navy/8 md:grid-cols-4">
            {items.map((item) => (
              <div key={item.label} className="bg-white px-5 py-6 text-center sm:px-6 sm:py-7">
                <p className="font-display text-2xl text-navy sm:text-[1.75rem]">{item.value}</p>
                <p className="mt-1 text-sm text-slate">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
