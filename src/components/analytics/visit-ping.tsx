"use client";

import { useEffect } from "react";

export function VisitPing() {
  useEffect(() => {
    const path = window.location.pathname;
    const key = `visit:${path}`;
    if (window.sessionStorage.getItem(key)) {
      return;
    }
    window.sessionStorage.setItem(key, "1");
    void fetch("/api/visits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
    });
  }, []);
  return null;
}
