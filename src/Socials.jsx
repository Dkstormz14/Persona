import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main3.mp4";
import newsign from "./assets/newsign.png";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";

const CHARS = [char1, char2, char3];

const ROLES = [
  { text: "LEADER", color: "#e8c100" },
  { text: "PARTY",  color: "#4a8fff" },
  { text: "PARTY",  color: "#4a8fff" },
];

const ITEMS = [
  {
    id: "linkedin",
    label: "LINKEDIN",
    handle: "@davonte-kesse",
    href: "https://www.linkedin.com/in/davonte-kesse-586258341/",
    icon: "🎮",
    barIcon: icon1,
    bars: 1,
    newBars: [0],
    counts: ["56"],
    links: ["https://www.linkedin.com/in/davonte-kesse-586258341/"],
    stats: [
      { tag: "FOL", value: "1.2K", color: "#9147ff" },
      { tag: "VWR", value: "042",  color: "#bf94ff" },
    ],
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    handle: "@yourhandle",
    href: "https://instagram.com/yourhandle",
    icon: "📷",
    barIcon: icon2,
    bars: 5,
    newBars: [1, 2],
    counts: ["3.4M", "2.5M", "676K", "412K", "198K"],
    links: [
      "instagram.com/p/C4xQmRrNk2a",
      "instagram.com/p/C3wLpBsOj7f",
      "instagram.com/reel/C2vKoArMi6e",
      "instagram.com/p/C1uJnZqLh5d",
      "instagram.com/reel/C0tImYpKg4c"
    ],
    stats: [
      { tag: "FOL", value: "3.4K", color: "#e1306c" },
      { tag: "PST", value: "128",  color: "#f77737" },
    ],
  },
  {
    id: "tiktok",
    label: "TIKTOK",
    handle: "@yourhandle",
    href: "https://tiktok.com/@yourhandle",
    icon: "🎵",
    barIcon: icon3,
    bars: 7,
    newBars: [0, 3, 5, 6],
    counts: ["5.1M", "3.7M", "2.2M", "1.4M", "831K", "490K", "217K"],
    links: ["tiktok.com/@yourhandle"],
    stats: [
      { tag: "FOL", value: "8.9K", color: "#00f2ea" },
      { tag: "LKS", value: "52K",  color: "#ff0050" },
    ],
  },
];

export default function Socials() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeInfoBar, setActiveInfoBar] = useState(0);
  const [focus, setFocus] = useState("left");
  const navigate = useNavigate();

  const isMobileViewport =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  // ✅ FIXED LINK HANDLING
  const resolveLink = (rawLink) => {
    if (/^(https?:\/\/|mailto:)/i.test(rawLink)) return rawLink;
    return "https://" + rawLink;
  };

  // ✅ CLEAN TEXT
  const formatInfoText = (text) => {
    const maxLength = 40;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // ✅ FIXED KEYBOARD SYSTEM
  useEffect(() => {
    const onKey = (e) => {
      if (focus === "left") {
        if (e.key === "ArrowUp") setActive(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown") setActive(i => Math.min(ITEMS.length - 1, i + 1));
        if (e.key === "ArrowRight") { setFocus("right"); setActiveInfoBar(0); }

        if (e.key === "Enter") {
          window.open(resolveLink(ITEMS[active].href), "_blank", "noopener,noreferrer");
        }
      } else {
        const barCount = ITEMS[active].bars;

        if (e.key === "ArrowUp") setActiveInfoBar(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown") setActiveInfoBar(i => Math.min(barCount - 1, i + 1));
        if (e.key === "ArrowLeft") setFocus("left");

        if (e.key === "Enter") {
          window.open(
            resolveLink(ITEMS[active].links[activeInfoBar]),
            "_blank",
            "noopener,noreferrer"
          );
        }
      }

      if (
        (e.key === "ArrowLeft" && focus === "left") ||
        e.key === "Escape" ||
        e.key === "Backspace"
      ) {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeInfoBar, navigate, focus]);

  return (
    <div id="menu-screen">
      <video src={bgVideo} autoPlay loop muted playsInline />

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              if (active === i) {
                window.open(resolveLink(item.href), "_blank", "noopener,noreferrer");
              } else {
                setActive(i);
              }
            }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            tabIndex={0}
            aria-label={active === i ? `Open ${item.label}` : `Select ${item.label}`}
            aria-pressed={active === i}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <img className="sc-char" src={CHARS[i]} alt="" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />

              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>

                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-icon">{item.icon}</div>
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>

                <div className="sc-stats">
                  {item.stats.map(s => (
                    <div className="sc-stat" key={s.tag}>
                      <div className="sc-stat-top">
                        <span className="sc-stat-tag" style={{ color: s.color, borderColor: s.color }}>
                          {s.tag}
                        </span>
                        <span className="sc-stat-num">{s.value}</span>
                      </div>
                      <div className="sc-stat-bars">
                        <div className="sc-stat-bar-color" style={{ background: s.color }} />
                        <div className="sc-stat-bar-black" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mounted && (
        <div className="sc-right-nav">
          <span>◄</span>
          <span>LB</span>
          <span>{ITEMS[active].label}</span>
          <span>RB</span>
          <span>►</span>
        </div>
      )}

      {mounted && (
        <div className="sc-info-panel">
          {Array.from({ length: ITEMS[active].bars }).map((_, i) => (
            <div
              key={i}
              className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
              onClick={() => {
                if (isMobileViewport || activeInfoBar === i) {
                  window.open(
                    resolveLink(ITEMS[active].links[i]),
                    "_blank",
                    "noopener,noreferrer"
                  );
                } else {
                  setActiveInfoBar(i);
                }
              }}
              onMouseEnter={() => setActiveInfoBar(i)}
              onFocus={() => setActiveInfoBar(i)}
              tabIndex={0}
              aria-label={`Select link ${i + 1}`}
              aria-pressed={activeInfoBar === i}
            >
              {ITEMS[active].newBars.includes(i) && (
                <img className="sc-info-bar-new" src={newsign} alt="" />
              )}

              <div className="sc-info-bar">
                <img className="sc-info-bar-icon" src={ITEMS[active].barIcon} alt="" />
                <span className="sc-info-bar-text">
                  {formatInfoText(ITEMS[active].links[i])}
                </span>
                <span className="sc-info-bar-box">VIEWS</span>
                <span className="sc-info-bar-count">{ITEMS[active].counts[i]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="sc-mobile-controls">
        <button onClick={() => navigate(-1)}>BACK</button>
        <button onClick={() => window.open(resolveLink(ITEMS[active].href), "_blank", "noopener,noreferrer")}>
          OPEN
        </button>
      </div>
    </div>
  );
}