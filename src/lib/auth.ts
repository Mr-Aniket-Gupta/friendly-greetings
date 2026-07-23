import { useEffect, useState } from "react";

const USER_KEY = "workday:user";
const FACE_KEY = "workday:face";
const QA_KEY = "workday:quickactions";

export type User = { name: string; email: string; empId: string };

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
}
export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("workday:auth"));
}
export function isFaceRegistered() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(FACE_KEY);
}
export function setFaceRegistered(dataUrl: string | null) {
  if (typeof window === "undefined") return;
  if (dataUrl) localStorage.setItem(FACE_KEY, dataUrl);
  else localStorage.removeItem(FACE_KEY);
}

export function useAuth() {
  const [user, setU] = useState<User | null>(null);
  const [hydrated, setH] = useState(false);
  useEffect(() => {
    setU(getUser());
    setH(true);
    const onChange = () => setU(getUser());
    window.addEventListener("workday:auth", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("workday:auth", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return { user, hydrated };
}

export function getQuickActions(): string[] | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(QA_KEY) || "null"); } catch { return null; }
}
export function saveQuickActions(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QA_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("workday:qa"));
}