"use client";

import { useState } from "react";
import { PLANS, type PlanId } from "@/lib/plans";

type Node = { reply: string; chips: { label: string; next: string }[]; plan?: PlanId };

// shortcut: scripted demo replies, a real assistant would be a live model with guardrails
const MORE = { label: "Which plan do I need?", next: "who" };
const SCRIPT: Record<string, Node> = {
  start: {
    reply: "Hi, I'm the plan assistant. This is a scripted demo chat. What would you like to know?",
    chips: [
      { label: "What's the difference between Self-service and Check?", next: "diff" },
      { label: "Check or Expert service?", next: "ce" },
      MORE,
    ],
  },
  diff: {
    reply:
      "With both, you complete the return yourself in the app. Self-service has automatic checks and email support, but no person reads your return. Self-service + Check adds an expert who reviews your finished return before it is submitted, plus chat support. You still do the work.",
    chips: [MORE, { label: "Check or Expert service?", next: "ce" }],
  },
  ce: {
    reply:
      "With Check, you do the return and an expert reviews it. With Expert service, an expert prepares and submits it for you from your uploaded documents. If you want to hand it over completely, that's Expert service.",
    chips: [MORE, { label: "What's the difference between Self-service and Check?", next: "diff" }],
  },
  who: {
    reply: "Quick way to decide: do you want to fill in the return yourself, or hand it over to an expert?",
    chips: [
      { label: "I'll fill it in myself", next: "review" },
      { label: "Hand it over", next: "expert" },
    ],
  },
  review: {
    reply: "Would you like an expert to read your finished return before it is sent?",
    chips: [
      { label: "Yes, I want an expert to read it", next: "check" },
      { label: "No, automatic checks are enough", next: "self" },
    ],
  },
  self: {
    reply: `Then Self-service (${PLANS.self.price}) fits: you do the return, the app checks it automatically, and you have email support.`,
    chips: [{ label: "Start over", next: "start" }],
    plan: "self",
  },
  check: {
    reply: `Then Self-service + Check (${PLANS.check.price}) fits: you do the return and an expert reviews it before it is sent, with chat support.`,
    chips: [{ label: "Start over", next: "start" }],
    plan: "check",
  },
  expert: {
    reply: `Then Expert service (${PLANS.expert.price}) fits: an expert prepares and sends the return for you from your documents.`,
    chips: [{ label: "Start over", next: "start" }],
    plan: "expert",
  },
};

export default function PlanChat({
  onResult,
  onChoose,
  onBack,
}: {
  onResult: (plan: PlanId | null) => void;
  onChoose: (plan: PlanId) => void;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<{ from: "bot" | "you"; text: string }[]>([
    { from: "bot", text: SCRIPT.start.reply },
  ]);
  const [node, setNode] = useState("start");
  const current = SCRIPT[node];

  function say(label: string, next: string) {
    const n = SCRIPT[next];
    setMessages((m) => (next === "start" ? [{ from: "bot", text: n.reply }] : [...m, { from: "you", text: label }, { from: "bot", text: n.reply }]));
    setNode(next);
    onResult(n.plan ?? null);
  }

  return (
    <section aria-labelledby="chat-heading" className="rounded-xl border-2 border-forest p-5">
      <h2 id="chat-heading" className="text-xl font-bold">Plan assistant</h2>
      <p className="text-sm text-muted">Demo chat with scripted replies. Not a live assistant.</p>
      <div role="log" aria-live="polite" className="mt-4 space-y-2">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 ${m.from === "bot" ? "bg-bar" : "ml-auto bg-lime-soft"}`}
          >
            {m.text}
          </p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {current.chips.map((c) => (
          <button
            key={c.label}
            onClick={() => say(c.label, c.next)}
            className="rounded-full border border-forest px-3 py-2 text-left text-sm font-semibold text-forest hover:bg-lime-soft"
          >
            {c.label}
          </button>
        ))}
        {current.plan && (
          <button
            onClick={() => onChoose(current.plan!)}
            className="rounded-lg bg-forest px-4 py-2 font-semibold text-white"
          >
            Choose {PLANS[current.plan].name}
          </button>
        )}
      </div>
      <button onClick={onBack} className="mt-4 text-sm font-semibold text-muted underline">
        Back to the questions
      </button>
    </section>
  );
}
