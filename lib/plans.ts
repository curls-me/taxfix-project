// shortcut: illustrative plans and prices from the case pack, a real pricing source replaces them
export type PlanId = "self" | "check" | "expert";

export const PLANS: Record<
  PlanId,
  { name: string; price: string; who: string; gets: string[] }
> = {
  self: {
    name: "Self-service",
    price: "€39",
    who: "You complete the return yourself.",
    gets: ["You complete the return yourself in the app", "Automatic checks", "Email support"],
  },
  check: {
    name: "Self-service + Check",
    price: "€79",
    who: "You do the return, an expert reviews it before it is sent.",
    gets: [
      "Everything in Self-service",
      "A tax expert reviews your return before it is submitted",
      "Chat support",
    ],
  },
  expert: {
    name: "Expert service",
    price: "€199",
    who: "An expert does the return and sends it for you.",
    gets: ["A tax expert prepares and submits your return", "Works from your uploaded documents"],
  },
};

export const PLAN_ORDER: PlanId[] = ["self", "check", "expert"];
