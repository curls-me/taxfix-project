"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type Profile, postcodeOk, readProfile, safeFrom, taxNumberOk, writeProfile,
} from "@/lib/profile";

const blank: Profile = { name: "", taxNumber: "", street: "", postcode: "", city: "" };

export default function Page() {
  const router = useRouter();
  const [p, setP] = useState<Profile>(blank);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});
  const [back, setBack] = useState("/account");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setP(readProfile());
    setBack(safeFrom(new URLSearchParams(window.location.search).get("from")));
  }, []);

  const set = (patch: Partial<Profile>) => setP({ ...p, ...patch });

  function save(ev: React.FormEvent) {
    ev.preventDefault();
    const e: typeof errors = {};
    if (!p.name.trim()) e.name = "Please enter your name";
    if (!p.taxNumber.trim()) e.taxNumber = "Please enter your tax number";
    else if (!taxNumberOk(p.taxNumber)) e.taxNumber = "Tax number should have 10 to 13 digits";
    if (!p.street.trim()) e.street = "Please enter your street and number";
    if (!p.postcode.trim()) e.postcode = "Please enter your postcode";
    else if (!postcodeOk(p.postcode)) e.postcode = "Postcode should have 5 digits";
    if (!p.city.trim()) e.city = "Please enter your city";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    if (!writeProfile({ ...p, name: p.name.trim(), taxNumber: p.taxNumber.trim(), street: p.street.trim(), postcode: p.postcode.trim(), city: p.city.trim() })) {
      setFailed(true);
      return;
    }
    router.push(back);
  }

  const field = "mt-2 w-full rounded-lg border border-muted px-3 py-2";
  const err = (k: keyof Profile) =>
    errors[k] && <p id={`${k}-err`} role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors[k]}</p>;
  const a11y = (k: keyof Profile) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
    "aria-required": true,
  });
  const lab = (id: string, text: string) => (
    <label htmlFor={id} className="font-semibold">
      {text} <span aria-hidden="true" className="text-red-700">*</span>
    </label>
  );

  return (
    <div className="max-w-xl">
      <Link href="/account" className="text-sm font-semibold text-forest underline">← Back to account</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-2 text-muted">
        We need these details before you can file. Demo only: use fictional data. Fields marked * are required.
      </p>

      <form onSubmit={save} noValidate className="mt-6 space-y-5">
        <div>
          {lab("name", "Full name")}
          <input id="name" autoComplete="off" placeholder="Max Mustermann" className={field} value={p.name} onChange={(e) => set({ name: e.target.value })} {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          {lab("taxNumber", "Tax number (Steuernummer)")}
          <input id="taxNumber" autoComplete="off" inputMode="numeric" placeholder="12/345/67890" className={field} value={p.taxNumber} onChange={(e) => set({ taxNumber: e.target.value })} {...a11y("taxNumber")} />
          {err("taxNumber")}
        </div>
        <div>
          {lab("street", "Street and number")}
          <input id="street" autoComplete="off" placeholder="Musterstr. 1" className={field} value={p.street} onChange={(e) => set({ street: e.target.value })} {...a11y("street")} />
          {err("street")}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            {lab("postcode", "Postcode")}
            <input id="postcode" autoComplete="off" inputMode="numeric" placeholder="10115" className={field} value={p.postcode} onChange={(e) => set({ postcode: e.target.value })} {...a11y("postcode")} />
            {err("postcode")}
          </div>
          <div>
            {lab("city", "City")}
            <input id="city" autoComplete="off" placeholder="Berlin" className={field} value={p.city} onChange={(e) => set({ city: e.target.value })} {...a11y("city")} />
            {err("city")}
          </div>
        </div>
        <p>
          <span className="font-semibold">Filing period:</span> Monthly{" "}
          <span className="text-muted">(the only option in this demo)</span>
        </p>

        {failed && <p role="alert" className="font-semibold text-red-700">Couldn&apos;t save in this browser.</p>}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="rounded-lg bg-forest px-5 py-2 font-semibold text-white">Save</button>
          <Link href={back} className="font-semibold underline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
