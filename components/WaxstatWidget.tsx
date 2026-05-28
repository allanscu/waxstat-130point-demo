"use client";

import { useEffect, useRef } from "react";

type Format =
  | "responsive"
  | "horizontal"
  | "vertical"
  | "card"
  | "compact"
  | "banner";

export default function WaxstatWidget({
  format = "responsive",
}: {
  format?: Format;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Re-trigger the widget if it was already loaded once on a prior render.
  useEffect(() => {
    const w = window as unknown as { WaxstatWidget?: { init?: () => void } };
    if (w.WaxstatWidget?.init) {
      try {
        w.WaxstatWidget.init();
      } catch {
        /* widget will self-init when script loads */
      }
    }
  }, []);

  return (
    <div
      ref={ref}
      id="waxstat-releases-widget"
      data-format={format}
    />
  );
}
