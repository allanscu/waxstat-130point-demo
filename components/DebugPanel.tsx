"use client";

import { useEffect, useRef, useState } from "react";

type Level = "log" | "warn" | "error" | "info" | "net";

type Entry = {
  id: number;
  ts: string;
  level: Level;
  text: string;
  count: number;
};

function fmt(arg: unknown): string {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "string") return arg;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

export default function DebugPanel() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const idRef = useRef(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only mount on explicit opt-in: ?debug=1 in the URL or
    // localStorage.waxstatDebug=1. Keeps the public demo clean.
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("debug") === "1";
    let fromStorage = false;
    try { fromStorage = window.localStorage.getItem("waxstatDebug") === "1"; } catch { /* private mode */ }
    if (fromUrl) {
      try { window.localStorage.setItem("waxstatDebug", "1"); } catch { /* noop */ }
    }
    setEnabled(fromUrl || fromStorage);
  }, []);

  const push = (level: Level, text: string) => {
    setEntries((prev) => {
      const last = prev[prev.length - 1];
      // Fold consecutive identical entries (same level + text) into one with a counter.
      if (last && last.level === level && last.text === text) {
        const updated = { ...last, count: last.count + 1, ts: new Date().toLocaleTimeString() };
        return [...prev.slice(0, -1), updated];
      }
      idRef.current += 1;
      const next = [
        ...prev,
        { id: idRef.current, ts: new Date().toLocaleTimeString(), level, text, count: 1 },
      ];
      return next.length > 200 ? next.slice(-200) : next;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) return;

    // ---- Patch console ----
    const origLog = console.log.bind(console);
    const origWarn = console.warn.bind(console);
    const origError = console.error.bind(console);
    const origInfo = console.info.bind(console);

    console.log = (...args) => { push("log", args.map(fmt).join(" ")); origLog(...args); };
    console.warn = (...args) => { push("warn", args.map(fmt).join(" ")); origWarn(...args); };
    console.error = (...args) => { push("error", args.map(fmt).join(" ")); origError(...args); };
    console.info = (...args) => { push("info", args.map(fmt).join(" ")); origInfo(...args); };

    // ---- Patch fetch ----
    const origFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const url = typeof input === "string"
        ? input
        : input instanceof URL ? input.href
        : (input as Request).url;
      const method = (init?.method || "GET").toUpperCase();
      push("net", `→ fetch ${method} ${url}`);
      try {
        const res = await origFetch(input, init);
        push("net", `← fetch ${method} ${url}  ${res.status} ${res.statusText}`);
        return res;
      } catch (e) {
        push("net", `✕ fetch ${method} ${url}  ${(e as Error).message}`);
        throw e;
      }
    };

    // ---- Patch XMLHttpRequest (axios uses this in the browser) ----
    const XHR = window.XMLHttpRequest;
    type PatchedXHR = XMLHttpRequest & { __wx_method?: string; __wx_url?: string };
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function (
      this: PatchedXHR,
      method: string,
      url: string | URL,
      ...rest: unknown[]
    ) {
      this.__wx_method = String(method).toUpperCase();
      this.__wx_url = typeof url === "string" ? url : url.href;
      return (origOpen as (...a: unknown[]) => void).call(this, method, url, ...rest);
    };
    XHR.prototype.send = function (this: PatchedXHR, body?: Document | XMLHttpRequestBodyInit | null) {
      const method = this.__wx_method || "GET";
      const url = this.__wx_url || "(unknown)";
      push("net", `→ xhr ${method} ${url}`);
      this.addEventListener("loadend", () => {
        if (this.status === 0) {
          push("net", `✕ xhr ${method} ${url}  status 0 (CORS / network)`);
        } else {
          push("net", `← xhr ${method} ${url}  ${this.status} ${this.statusText}`);
        }
      });
      return origSend.call(this, body);
    };

    // ---- Window error / unhandled rejection ----
    const onErr = (ev: ErrorEvent) => push("error", `window.onerror: ${ev.message} @ ${ev.filename}:${ev.lineno}`);
    const onRej = (ev: PromiseRejectionEvent) => push("error", `unhandledrejection: ${fmt(ev.reason)}`);
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);

    push("info", `Debug panel armed at ${new Date().toLocaleTimeString()}`);
    push("info", `WAXSTAT widget url: ${process.env.NEXT_PUBLIC_WAXSTAT_WIDGET_URL || "(default)"}`);

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      console.info = origInfo;
      window.fetch = origFetch;
      XHR.prototype.open = origOpen;
      XHR.prototype.send = origSend;
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, [enabled]);

  if (!enabled) return null;

  // auto-scroll
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [entries]);

  const [copied, setCopied] = useState(false);
  const copyAll = async () => {
    const text = entries
      .map((e) => `${e.ts}\t${e.level.toUpperCase()}\t${e.count > 1 ? `(×${e.count}) ` : ""}${e.text}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const colorFor = (l: Level) => {
    switch (l) {
      case "error": return "#ff8080";
      case "warn":  return "#ffcc66";
      case "net":   return "#7fd1ff";
      case "info":  return "#a3e8c8";
      default:      return "#dadfe6";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        width: open ? "min(680px, calc(100vw - 24px))" : 180,
        zIndex: 9999,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        color: "#dadfe6",
        background: "rgba(15, 18, 24, 0.96)",
        border: "1px solid #2a3140",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 12px", cursor: "pointer",
          borderBottom: open ? "1px solid #2a3140" : "none",
          fontWeight: 600,
        }}
      >
        <span>🐞 Debug log · {entries.length}</span>
        <span style={{ display: "flex", gap: 8 }}>
          {open && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); copyAll(); }}
                style={{
                  background: copied ? "#15a06b" : "transparent",
                  color: copied ? "#fff" : "#a3aab5",
                  border: "1px solid " + (copied ? "#15a06b" : "#2a3140"),
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {copied ? "copied ✓" : "copy"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setEntries([]); }}
                style={{ background: "transparent", color: "#a3aab5", border: "1px solid #2a3140", borderRadius: 6, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}
              >
                clear
              </button>
            </>
          )}
          <span style={{ color: "#7a8493" }}>{open ? "▾" : "▸"}</span>
        </span>
      </div>
      {open && (
        <div
          ref={listRef}
          style={{
            maxHeight: 280,
            overflow: "auto",
            padding: "8px 12px",
            lineHeight: 1.45,
          }}
        >
          {entries.length === 0 ? (
            <div style={{ color: "#7a8493" }}>(no log entries yet — refresh the page)</div>
          ) : (
            entries.map((e) => (
              <div key={e.id} style={{ display: "flex", gap: 8, padding: "2px 0" }}>
                <span style={{ color: "#7a8493", flexShrink: 0 }}>{e.ts}</span>
                <span style={{ color: colorFor(e.level), flexShrink: 0, width: 36, textTransform: "uppercase" }}>{e.level}</span>
                {e.count > 1 && (
                  <span style={{
                    flexShrink: 0,
                    color: "#0e1218",
                    background: colorFor(e.level),
                    padding: "0 6px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}>×{e.count}</span>
                )}
                <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{e.text}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
