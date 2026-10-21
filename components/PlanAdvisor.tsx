"use client";

import { useEffect, useRef, useState } from "react";
import PlanChat from "@/components/PlanChat";
import { PLANS, type PlanId } from "@/lib/plans";

type Option = { value: string; label: string; hint: string };

const QUESTIONS: { title: string; options: Option[] }[] = [
  {
    title: "Who fills in your return?",
    options: [
      { value: "self", label: "I'll fill it in myself, in the app", hint: "You enter your details and submit." },
      { value: "hand", label: "I'd rather hand it over", hint: "An expert does and sends it for you." },
    ],
  },
  {
    title: "Before it is sent, what do you want?",
    options: [
      {
        value: "checks",
        label: "The app's automatic checks are enough for me",
        hint: "The app flags missing or inconsistent entries. No person reads your return.",
      },
      {
        value: "expert",
        label: "I want an expert to read my finished return before it goes to the tax office",
        hint: "You still do all the work. An expert reviews it before it is submitted.",
      },
    ],
  },
  {
    title: "If you get stuck, how do you want help?",
    options: [
      { value: "email", label: "By email", hint: "Email support comes with Self-service." },
      { value: "chat", label: "In a chat with someone", hint: "Chat support comes with Self-service + Check." },
    ],
  },
];

// shortcut: fixed rules on two answers, a real advisor would weigh the full situation
function recommend(a: string[]): PlanId {
  if (a[0] === "hand") return "expert";
  return a[1] === "expert" ? "check" : "self";
}

function reasons(a: string[], plan: PlanId): string[] {
  const r: string[] = [];
  if (plan === "expert") {
    r.push("You'd rather hand it over, and with Expert an expert prepares and sends your return.");
    if (a[1] === "expert") r.push("You want a person involved. Here an expert handles the whole return, not only a review.");
    return r;
  }
  r.push("You'll fill in the return yourself.");
  r.push(
    plan === "check"
      ? "You want an expert to read your finished return before it is sent. That review is what Check adds."
      : "Automatic checks are enough for you. Self-service has them, and no person reads your return."
  );
  if (a[2] === "chat" && plan === "self")
    r.push("You'd like chat help. Chat comes only with Check; Self-service has email support.");
  if (a[2] === "email" && plan === "check")
    r.push("Check also includes chat support, on top of Self-service's email support.");
  return r;
}

export default function PlanAdvisor({
  onResult,
  onChoose,
  onPickOther,
}: {
  onResult: (plan: PlanId | null) => void;
  onChoose: (plan: PlanId) => void;
  onPickOther: () => void;
}) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => heading.current?.focus(), [step]);

  if (chat)
    return (
      <PlanChat
        onResult={onResult}
        onChoose={onChoose}
        onBack={() => {
          onResult(null);
          setChat(false);
        }}
      />
    );

  const done = step === QUESTIONS.length;
  const plan = done ? recommend(answers) : null;

  function next() {
    if (step === QUESTIONS.length - 1) onResult(recommend(answers));
    setStep(step + 1);
  }

  function startOver() {
    setAnswers([]);
    setStep(0);
    onResult(null);
  }

  if (plan) {
    const other: PlanId = plan === "self" ? "check" : plan === "check" ? "self" : "check";
    return (
      <section aria-labelledby="advisor-heading" className="rounded-xl border-2 border-forest p-5">
        <h2 id="advisor-heading" ref={heading} tabIndex={-1} className="text-xl font-bold">
          We'd suggest {PLANS[plan].name} ({PLANS[plan].price})
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {reasons(answers, plan).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {[plan, other].map((id) => (
            <div key={id} className="rounded-lg bg-bar p-3">
              <p className="font-semibold">
                {PLANS[id].name} · {PLANS[id].price}
              </p>
              <p className="text-muted">{PLANS[id].who}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => onChoose(plan)} className="rounded-lg bg-forest px-4 py-2 font-semibold text-white">
            Choose {PLANS[plan].name}
          </button>
          <button onClick={onPickOther} className="rounded-lg border border-forest px-4 py-2 font-semibold text-forest">
            Pick a different plan
          </button>
          <button onClick={startOver} className="px-4 py-2 font-semibold text-muted underline">
            Start over
          </button>
        </div>
      </section>
    );
  }

  const q = QUESTIONS[step];
  return (
    <section aria-labelledby="advisor-heading" className="rounded-xl border-2 border-forest p-5">
      <p className="text-sm text-muted">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h2 id="advisor-heading" ref={heading} tabIndex={-1} className="mt-1 text-xl font-bold">
        {q.title}
      </h2>
      <fieldset className="mt-4 space-y-3">
        <legend className="sr-only">{q.title}</legend>
        {q.options.map((o) => (
          <label key={o.value} className="flex cursor-pointer gap-3 rounded-lg border border-bar p-3 has-[:checked]:border-forest has-[:checked]:bg-lime-soft">
            <input
              type="radio"
              name={`q${step}`}
              checked={answers[step] === o.value}
              onChange={() => setAnswers((a) => Object.assign([...a], { [step]: o.value }))}
              className="mt-1"
            />
            <span>
              <span className="block font-medium">{o.label}</span>
              <span className="block text-sm text-muted">{o.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-forest">What's the difference?</summary>
        <p className="mt-2 text-muted">
          <strong>Self-service ({PLANS.self.price}):</strong> you complete the return yourself, the app runs automatic checks, and no person reads it. <strong>Self-service + Check ({PLANS.check.price}):</strong> the same, plus an expert reviews your finished return before it is submitted. You still do the work. <strong>Expert service ({PLANS.expert.price}):</strong> an expert does the return for you.
        </p>
      </details>
      <button onClick={() => setChat(true)} className="mt-3 text-sm font-semibold text-forest underline">
        Still unsure? Chat with the plan assistant
      </button>
      <div className="mt-5 flex items-center gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="rounded-lg border border-forest px-4 py-2 font-semibold text-forest">
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!answers[step]}
          className="rounded-lg bg-forest px-4 py-2 font-semibold text-white disabled:opacity-40"
        >
          {step === QUESTIONS.length - 1 ? "See my plan" : "Next"}
        </button>
        {!answers[step] && <span className="text-sm text-muted">Pick one to continue</span>}
      </div>
    </section>
  );
}
