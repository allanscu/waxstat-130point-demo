import WaxstatWidget from "@/components/WaxstatWidget";

type FeatureCard = {
  id: string;
  year: string;
  player: string;
  grade: string;
  source: string;
  title: string;
  price: number;
  bids: number;
  endsIn: string;
  bgA: string;
  bgB: string;
};

const FEATURED: FeatureCard[] = [
  { id: "f1", year: "2000",  player: "TB-12",  grade: "BGS 9.5", source: "Auction A · Showcase",  title: "2000 PLAYOFF CONTENDERS AUTOGRAPH #144 TOM BRADY RC", price: 43101, bids: 61, endsIn: "3d 2h 40m", bgA: "#2a4a78", bgB: "#0e1d34" },
  { id: "f2", year: "1986",  player: "MJ-23",  grade: "PSA 9",   source: "Auction A · Consign",   title: "1986-87 FLEER #57 MICHAEL JORDAN RC ROOKIE CENTERED", price: 39301, bids: 60, endsIn: "4h 38m",   bgA: "#a8421a", bgB: "#3a160a" },
  { id: "f3", year: "1993",  player: "MJ-23",  grade: "GEM MT 10", source: "Auction A · Showcase", title: "1993 FINEST REFRACTOR #1 MICHAEL JORDAN BULLS HOF",   price: 25300, bids: 64, endsIn: "3d 2h 40m", bgA: "#3d6c63", bgB: "#10211f" },
  { id: "f4", year: "1984",  player: "MJ-23",  grade: "NM 7",    source: "Auction A",             title: "1984 STAR #195 MICHAEL JORDAN ROOKIE RC PSA 7",        price: 25299, bids: 57, endsIn: "6d 3h 44m", bgA: "#a8392f", bgB: "#3a110d" },
  { id: "f5", year: "1979",  player: "WG-99",  grade: "PSA 9",   source: "Auction B",             title: "1979 O-PEE-CHEE WAYNE GRETZKY #18 RC PSA 9 EARLY GRADE", price: 24099, bids: 13, endsIn: "3d 21h 41m", bgA: "#1b4d8f", bgB: "#0a1f3c" },
  { id: "f6", year: "2004",  player: "MJ/LJ",  grade: "BGS 8.5", source: "Auction A",             title: "MICHAEL JORDAN LEBRON JAMES 2004 UPPER DECK TRILOGY CLEARCUT AUTO", price: 19600, bids: 40, endsIn: "3d 5h 10m", bgA: "#2f2f2f", bgB: "#0d0d0d" },
  { id: "f7", year: "1985",  player: "MJ-23",  grade: "NM 7",    source: "Auction A",             title: "1985 STAR CRUNCH N MUNCH MICHAEL JORDAN",              price: 19400, bids: 33, endsIn: "3d 4h 6m",  bgA: "#a55410", bgB: "#3b1d05" },
];

const SOURCES = [
  { label: "eBay",     dark: false },
  { label: "Fanatics", dark: true  },
  { label: "Goldin",   dark: false },
  { label: "SLABS",    dark: true  },
  { label: "Pristine", dark: true  },
  { label: "Heritage", dark: true  },
];

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

/* simple inline icons (no extra deps) */
function IconSliders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      {/* ---------- Header ---------- */}
      <header className="site-header">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <a className="brand-wordmark" href="#">
            <span className="brand-num">CC</span>
            <span className="brand-suffix">comps</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="#widget" className="header-link">
              <span className="label-strong">WAXSTAT</span>
              <span style={{ color: "var(--ink-soft)" }}>Release Calendar</span>
            </a>
            <button className="icon-btn" aria-label="Toggle theme"><IconMoon /></button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <h1 className="hero-title">Find your next card</h1>

          <form className="pill-search" action="#widget">
            <input type="text" placeholder="Search by player, set, year, etc" aria-label="Card search" />
            <button type="button" className="filter-btn" aria-label="Filters"><IconSliders /></button>
            <button type="submit" className="search-btn" aria-label="Search"><IconSearch /></button>
          </form>

          <p className="hero-disclaimer">
            Disclaimer: this is a demonstration page. The data, prices, and listings shown are placeholder
            content used only to illustrate how the Waxstat releases widget embeds inside a host site.
          </p>

          <p className="compare-label">Compare millions of sold and live listings across</p>
          <div className="source-row">
            {SOURCES.map((s) => (
              <span key={s.label} className={`source-pill ${s.dark ? "dark" : ""}`}>
                <span className="swatch" style={{ background: s.dark ? "#ffffff" : "var(--accent)" }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Widget embed ---------- */}
      <section id="widget" className="max-w-6xl mx-auto px-6 mt-10">
        <div className="widget-callout">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="widget-callout-eyebrow">
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0e7a52", display: "inline-block" }} />
              Embedded widget · Waxstat Releases
            </span>
            <span className="text-xs" style={{ color: "var(--ink-dim)" }}>
              Dropped in with one &lt;script&gt; tag
            </span>
          </div>
          <WaxstatWidget format="responsive" />
        </div>
      </section>

      {/* ---------- Featured auctions ---------- */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="section-head">
          <h2 className="section-title">Featured Auctions</h2>
          <div className="section-tools">
            <button className="round-arrow" aria-label="Previous"><IconChevron dir="left" /></button>
            <button className="round-arrow" aria-label="Next"><IconChevron dir="right" /></button>
            <span className="view-all">View All ›</span>
          </div>
        </div>

        <div className="feature-row">
          {FEATURED.map((c) => (
            <div
              key={c.id}
              className="feature-card"
              style={{
                ["--card-bg-a" as string]: c.bgA,
                ["--card-bg-b" as string]: c.bgB,
              }}
            >
              <div className="frame">
                <div className="frame-inner">
                  <span className="frame-year">{c.year}</span>
                  <span className="frame-name">{c.player}</span>
                  <span className="frame-grade">{c.grade}</span>
                </div>
              </div>
              <span className="source-tag"><span className="dot" />{c.source}</span>
              <div className="card-title">{c.title}</div>
              <div className="card-price">{formatPrice(c.price)} USD</div>
              <div className="card-meta">
                <span>{c.bids} bids</span>
                <span className="ends">{c.endsIn}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Trending auctions (second row, same style) ---------- */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="section-head">
          <h2 className="section-title">Trending Auctions</h2>
          <div className="section-tools">
            <button className="round-arrow" aria-label="Previous"><IconChevron dir="left" /></button>
            <button className="round-arrow" aria-label="Next"><IconChevron dir="right" /></button>
            <span className="view-all">View All ›</span>
          </div>
        </div>

        <div className="feature-row">
          {FEATURED.slice().reverse().map((c) => (
            <div
              key={`t-${c.id}`}
              className="feature-card"
              style={{
                ["--card-bg-a" as string]: c.bgA,
                ["--card-bg-b" as string]: c.bgB,
              }}
            >
              <div className="frame">
                <div className="frame-inner">
                  <span className="frame-year">{c.year}</span>
                  <span className="frame-name">{c.player}</span>
                  <span className="frame-grade">{c.grade}</span>
                </div>
              </div>
              <span className="source-tag"><span className="dot" />{c.source}</span>
              <div className="card-title">{c.title}</div>
              <div className="card-price">{formatPrice(c.price)} USD</div>
              <div className="card-meta">
                <span>{c.bids} bids</span>
                <span className="ends">{c.endsIn}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="site-footer">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3">
          <span>Demo site · embeds the Waxstat releases widget · not affiliated with 130point.com</span>
          <span>© {new Date().getFullYear()} CCcomps demo</span>
        </div>
      </footer>
    </main>
  );
}
