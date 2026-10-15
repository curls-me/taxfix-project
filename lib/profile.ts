"use client";

import { useEffect, useState } from "react";

export type Profile = { name: string; taxNumber: string; street: string; postcode: string; city: string };

const KEY = "vat-companion.profile.v1";
export const emptyProfile: Profile = { name: "", taxNumber: "", street: "", postcode: "", city: "" };

export function readProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : {};
    const out = { ...emptyProfile };
    for (const k of Object.keys(out) as (keyof Profile)[]) if (typeof p?.[k] === "string") out[k] = p[k];
    return out;
  } catch {
    return emptyProfile;
  }
}

export function writeProfile(p: Profile): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

// The one completeness check used by Account, Dashboard and VAT return.
export const isProfileComplete = (p: Profile) =>
  Object.values(p).every((v) => v.trim() !== "");

export const taxNumberOk = (s: string) => /^\d{10,13}$/.test(s.replace(/[\s/]/g, ""));
export const postcodeOk = (s: string) => /^\d{5}$/.test(s.trim());

// Only internal paths are accepted, so ?from= cannot send testers to another site.
export const safeFrom = (from: string | null) =>
  from && from.startsWith("/") && !from.startsWith("//") && !from.includes("\\") ? from : "/account";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProfile(readProfile());
    setReady(true);
  }, []);
  return { ready, profile, complete: ready && isProfileComplete(profile) };
}
