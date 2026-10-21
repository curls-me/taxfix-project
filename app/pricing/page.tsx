"use client";

import { useRef, useState } from "react";
import PlanAdvisor from "@/components/PlanAdvisor";
import { PLANS, PLAN_ORDER, type PlanId } from "@/lib/plans";

export default function Page() {
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [recommended, setRecommended] = useState<PlanId | null>(null);
  const [chosen, setChosen] = useState<PlanId | null>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  function choose(id: PlanId) {
    setChosen(id);
    setAdvisorOpen(false);
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose your plan</h1>
      <p className="mt-3 text-lg text-muted">For your annual tax return as a self-employed person.</p>

      {chosen ? (
        <div role="status" className="mt-8 rounded-xl bg-lime-soft p-5">
          <p className="font-semibold">You chose {PLANS[chosen].name} ({PLANS[chosen].price}).</p>
          <p>Demo: checkout isn't built. Nothing was submitted or paid.</p>
          <button onClick={() => setChosen(null)} className="mt-3 font-semibold text-forest underline">
            Back to plans
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {advisorOpen ? (
              <PlanAdvisor
                onResult={setRecommended}
                onChoose={choose}
                onPickOther={() => {
                  setAdvisorOpen(false);
                  plansRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            ) : (
              <button
                onClick={() => setAdvisorOpen(true)}
                className="w-full rounded-xl bg-forest px-5 py-4 text-left text-lg font-semibold text-white sm:w-auto"
              >
                Not sure which plan? Answer 3 quick questions
              </button>
            )}
          </div>

          <div ref={plansRef} className="mt-8 grid gap-4 md:grid-cols-3">
            {PLAN_ORDER.map((id) => (
              <section
                key={id}
                aria-labelledby={`plan-${id}`}
                className={`flex flex-col rounded-xl border p-5 ${
                  recommended === id ? "border-2 border-forest bg-lime-soft" : "border-bar"
                }`}
              >
                {recommended === id && <p className="mb-2 text-sm font-semibold text-forest">Recommended for you</p>}
                <h2 id={`plan-${id}`} className="text-xl font-bold">
                  {PLANS[id].name}
                </h2>
                <p className="mt-1 text-3xl font-bold">{PLANS[id].price}</p>
                <p className="mt-2 font-medium">{PLANS[id].who}</p>
                <ul className="mt-3 flex-1 list-disc space-y-1 pl-5 text-muted">
                  {PLANS[id].gets.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <button
                  onClick={() => choose(id)}
                  className="mt-5 rounded-lg border border-forest px-4 py-2 font-semibold text-forest hover:bg-lime-soft"
                >
                  Choose this plan
                </button>
              </section>
            ))}
          </div>

          <section aria-labelledby="differ" className="mt-8 rounded-xl bg-bar p-5">
            <h2 id="differ" className="text-lg font-bold">How the plans differ</h2>
            <ul className="mt-2 space-y-1">
              <li><strong>Self-service + Check:</strong> you do the return, an expert reviews it before it is sent.</li>
              <li><strong>Expert service:</strong> an expert does and sends the return for you, from your documents.</li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
