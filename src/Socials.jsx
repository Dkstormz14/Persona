import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main3.mp4";
import newsign from "./assets/newsign.png";

const SOCIALS_COPY = {
  fr: {
    labels: ["GITHUB", "LINKEDIN", "CONTACT"],
    selectLink: "Selectionner lien",
    itemOpen: "Ouvrir",
    itemSelect: "Selectionner",
    contactLine: "mailto:maelbelhacene38.pro@gmail.com - En poste jusqu'en 2028 (alternance), ouvert aux echanges techniques/collaborations ciblees",
    footer: { select: "SÉLECTIONNER", open: "OUVRIR", back: "RETOUR" },
  },
  en: {
    labels: ["GITHUB", "LINKEDIN", "CONTACT"],
    selectLink: "Select link",
    itemOpen: "Open",
    itemSelect: "Select",
    contactLine: "mailto:maelbelhacene38.pro@gmail.com - Employed until 2028 (work-study), open to technical discussions/selected collaborations",
    footer: { select: "SELECT", open: "OPEN", back: "BACK" },
  },
};

const CHARS = [char1, char2, char3];

const ROLES = [
  { text: "ONI", color: "#ffd230", bg: "rgba(255,210,48,0.12)", border: "rgba(255,210,48,0.5)" },
  { text: "CREW", color: "#d32828", bg: "rgba(211,40,40,0.12)", border: "rgba(211,40,40,0.45)" },
  { text: "ZONE", color: "#ffd230", bg: "rgba(255,210,48,0.12)", border: "rgba(255,210,48,0.5)" },
];

const ITEMS = [
  {
    id: "twitch", label: "GITHUB", handle: "@mael", href: "https://github.com/MaelBelhacene", icon: "💻", bars: 1, newBars: [0],
    links: ["github.com/MaelBelhacene"],
  },
  {
    id: "instagram", label: "LINKEDIN", handle: "@mael", href: "https://www.linkedin.com/in/mael-belhacene-89545b294/", icon: "💼", bars: 1, newBars: [0],
    links: ["www.linkedin.com/in/mael-belhacene-89545b294/"],
  },
  {
    id: "tiktok", label: "CONTACT", handle: "@mael", href: "mailto:maelbelhacene38.pro@gmail.com", icon: "📨", bars: 1, newBars: [0],
    links: ["mailto:maelbelhacene38.pro@gmail.com - Ouvert a toute collaboration commerciale"],
  },
];

export default function Socials({ lang = "fr" }) {
  const locale = lang === "en" ? "en" : "fr";
  const copy = SOCIALS_COPY[locale];
  const localizedItems = useMemo(
    () => ITEMS.map((item, index) => ({
      ...item,
      label: copy.labels[index],
      links: item.id === "tiktok" ? [copy.contactLine] : item.links,
    })),
    [copy.labels, copy.contactLine],
  );
  const [active, setActive]               = useState(0);
  const [mounted, setMounted]             = useState(false);
  const [activeInfoBar, setActiveInfoBar] = useState(0);
  const [focus, setFocus]                 = useState("left"); // "left" | "right"
  const navigate = useNavigate();

  const resolveLink = (rawLink) => {
    if (/^(https?:\/\/|mailto:)/i.test(rawLink)) return rawLink;
    return "https://" + rawLink;
  };

  const formatInfoText = (text) => {
    const maxLength = 64;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (focus === "left") {
        if (e.key === "ArrowUp")    setActive(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown")  setActive(i => Math.min(localizedItems.length - 1, i + 1));
        if (e.key === "ArrowRight") { setFocus("right"); setActiveInfoBar(0); }
        if (e.key === "Enter")      window.open(resolveLink(localizedItems[active].href), "_blank", "noopener,noreferrer");
      } else {
        const barCount = localizedItems[active].bars;
        if (e.key === "ArrowUp")   setActiveInfoBar(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown") setActiveInfoBar(i => Math.min(barCount - 1, i + 1));
        if (e.key === "ArrowLeft") setFocus("left");
        if (e.key === "Enter")     window.open(resolveLink(localizedItems[active].links[activeInfoBar]), "_blank", "noopener,noreferrer");
      }
      if ((e.key === "ArrowLeft" && focus === "left") || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeInfoBar, navigate, focus, localizedItems]);

  return (
    <div id="menu-screen" className="gto-social-screen">
      <video src={bgVideo} autoPlay loop muted playsInline preload="auto" className="sc-bg-video" />
      <style>{`
        .sc-bg-video {
          object-position: center center;
          filter: saturate(1.05) contrast(1.04) brightness(0.96);
          transform: scale(1.01);
          transform-origin: center;
        }
        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          padding-left: 0;
        }
        .sc-root::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            -10deg,
            rgba(255, 210, 48, 0.02) 0 8px,
            rgba(0, 0, 0, 0) 8px 22px
          );
          mix-blend-mode: soft-light;
        }

        /* ── Each bar ── */
        .sc-bar {
          position: relative;
          width: 45vw;
          height: 64px;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #111;
          cursor: pointer;
          pointer-events: all;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          z-index: 1;
          border: 1px solid rgba(255, 210, 48, 0.2);
        }

        /* wrapper holds both the red underlay and the bar */
        .sc-bar-outer {
          position: relative;
          flex-shrink: 0;
          display: block;
          text-align: left;
          background: transparent;
          border: 0;
          padding: 0;
          font: inherit;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-bar-outer:focus-visible {
          outline: 2px solid #ffd230;
          outline-offset: 4px;
        }
        .sc-bar-outer:hover {
          transform: translateX(4px);
        }
        .sc-bar-outer.active .sc-bar     { height: 90px; }
        .sc-bar-outer.active .sc-bar-red { height: 90px; }
        .sc-bar-outer.mounted { transform: translateX(0); }
        .sc-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .sc-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .sc-bar-outer:nth-child(3) { transition-delay: 160ms; }

        /* red underlay — peeks out below the bar when active */
        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 45vw;
          height: 64px;
          background: #d32828;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .sc-bar-outer.active .sc-bar-red { opacity: 1; }

        /* white fill — skewed parallelogram on the right 25% */
        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: #ffd230;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }

        /* shade on the left edge of the white fill */
        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        /* bottom shadow line under each bar */
        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }

        /* content layout inside each bar */
        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 20px;
        }

        /* left: role label */
        .sc-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-family: var(--gto-font-display);
          font-size: 50px;
          letter-spacing: -2px;
          color: #ffffff;
          transform: rotate(-30deg);
          user-select: none;
          line-height: 1;
          padding: 0 16px 0 8px;
          -webkit-text-stroke: 1px rgba(0, 0, 0, 0.4);
        }

        /* left: icon + name centered in remaining space */
        .sc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }
        .sc-main-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sc-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.15);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-icon { color: rgba(255,255,255,0.25); }

        .sc-label {
          font-family: var(--gto-font-ui);
          font-size: 28px;
          letter-spacing: 4px;
          line-height: 1;
          color: rgba(255, 244, 204, 0.95);
          transition: color 0.2s ease;
          user-select: none;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
        }
        .sc-bar-outer.active .sc-label { color: #181818; }

        /* lb/rb nav row */
        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(-5px); opacity: 0.4; }
        }
        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(5px); opacity: 0.4; }
        }
        .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          color: #ffd230;
          border: 1px solid rgba(0,0,0,0.35);
          padding: 1px 7px;
          line-height: 1.5;
          user-select: none;
        }
        .sc-nav-arrow {
          font-size: 12px;
          color: #d32828;
          display: inline-block;
        }
        .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        /* character portrait */
        .sc-char {
          position: absolute;
          top: 0;
          left: 110px;
          height: 100%;
          width: auto;
          max-width: 160px;
          object-fit: cover;
          object-position: top;
          pointer-events: none;
          z-index: 3;
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }

        /* right-side nav bar */
        @keyframes sc-right-nav-pop {
          0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
          65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sc-right-nav {
          position: fixed;
          top: 40px;
          right: 40px;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          z-index: 50;
          animation: sc-right-nav-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-right-nav .sc-nav-btn {
          font-family: var(--gto-font-ui);
          font-size: 100px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #fff;
          -webkit-text-stroke: 2px #000;
          paint-order: stroke fill;
          background: none;
          border: none;
          padding: 0 6px;
        }
        .sc-right-nav .sc-nav-label {
          font-family: var(--gto-font-ui);
          font-size: 28px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #ffd230;
          padding: 0 8px;
        }
        .sc-right-nav .sc-nav-arrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #d32828;
          display: inline-block;
          user-select: none;
        }
        .sc-right-nav .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-right-nav .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        /* info bar under nav */
        @keyframes sc-infobar-in {
          0%   { opacity: 0; transform: translateX(40px); }
          60%  { opacity: 1; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .sc-info-bar-wrap {
          position: fixed;
          right: 0;
          left: 65%;
          top: calc(155px + (var(--info-index) * 52px));
          height: 46px;
          display: block;
          text-align: left;
          background: transparent;
          border: 0;
          pointer-events: all;
          cursor: pointer;
          z-index: 50;
          padding: 0;
          font: inherit;
          animation: sc-infobar-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
          transition: transform 0.18s ease;
        }
        .sc-info-bar-wrap:focus-visible {
          outline: 2px solid #ffd230;
          outline-offset: 4px;
        }
        .sc-info-bar-wrap:hover {
          transform: translateX(-4px);
        }
        .sc-info-bar-wrap.selected {
          background: #1a1a1a;
          padding: 1.5px;
          border-radius: 8px;
        }
        .sc-info-bar {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .sc-info-bar-wrap.selected .sc-info-bar {
          background: #fff4cc;
          border-radius: 7px;
        }
        .sc-info-bar-new {
          position: absolute;
          left: -40px;
          bottom: 0;
          height: 65%;
          width: auto;
          pointer-events: none;
          z-index: 3;
        }
        .sc-info-bar-wrap.selected .sc-info-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: #d32828;
          z-index: 1;
        }
        .sc-info-bar-text {
          flex: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: #111;
          padding: 0 14px;
          user-select: none;
        }
        /* footer hints */
        .sc-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 50;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .sc-footer.mounted { opacity: 1; }
        .sc-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255, 244, 204, 0.5);
        }
        .sc-footer-key {
          border: 1px solid rgba(255, 210, 48, 0.35);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }

        .gto-social-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 11;
          background: repeating-linear-gradient(
            -12deg,
            rgba(255, 210, 48, 0.03) 0 10px,
            rgba(0, 0, 0, 0) 10px 26px
          );
          mix-blend-mode: soft-light;
        }

        @media (max-width: 1024px) {
          .sc-bar,
          .sc-bar-red {
            width: 58vw;
          }
          .sc-char {
            left: 74px;
            max-width: 122px;
          }
          .sc-right-nav .sc-nav-btn {
            font-size: 72px;
          }
          .sc-right-nav .sc-nav-label {
            font-size: 20px;
          }
          .sc-info-bar-wrap {
            left: 52%;
          }
        }

        @media (max-width: 768px) {
          .sc-root {
            justify-content: flex-start;
            padding-top: 15vh;
            gap: 4px;
          }
          .sc-bar,
          .sc-bar-red {
            width: 92vw;
            height: 56px;
          }
          .sc-bar-outer.active .sc-bar,
          .sc-bar-outer.active .sc-bar-red {
            height: 68px;
          }
          .sc-char {
            display: none;
          }
          .sc-role {
            font-size: 32px;
            padding-left: 4px;
          }
          .sc-label {
            font-size: 22px;
            letter-spacing: 2px;
          }
          .sc-main {
            align-items: flex-start;
          }
          .sc-right-nav {
            top: 8px;
            right: 8px;
            transform: scale(0.68);
            transform-origin: top right;
          }
          .sc-info-bar-wrap {
            top: auto !important;
            left: 10%;
            right: 2%;
            bottom: calc(118px + (var(--info-index) * 42px));
            height: 38px;
          }
          .sc-info-bar-text {
            font-size: 15px;
            letter-spacing: 1px;
            padding: 0 8px;
          }
          .sc-footer {
            right: 8px;
            bottom: 8px;
            transform: scale(0.9);
            transform-origin: bottom right;
          }
        }
      `}</style>

      <div className="sc-root" role="navigation">
        {localizedItems.map((item, i) => (
          <button
            type="button"
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              if (active === i) window.open(item.href, "_blank", "noopener,noreferrer");
              else setActive(i);
            }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            aria-label={active === i ? `${copy.itemOpen} ${item.label}` : `${copy.itemSelect} ${item.label}`}
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
              </div>
            </div>
          </button>
        ))}
      </div>

      {mounted && (
        <div className="sc-right-nav" key={active}>
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-label">{localizedItems[active].label}</span>
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}

      {mounted && Array.from({ length: localizedItems[active].bars }).map((_, i) => (
        <button
          type="button"
          className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
          key={`bar-${active}-${i}`}
          style={{ "--info-index": i, animationDelay: `${i * 50}ms` }}
          onClick={() => setActiveInfoBar(i)}
          onMouseEnter={() => setActiveInfoBar(i)}
          onFocus={() => setActiveInfoBar(i)}
          aria-label={`${copy.selectLink} ${i + 1} ${locale === "fr" ? "de" : "for"} ${localizedItems[active].label}`}
          aria-pressed={activeInfoBar === i}
        >
          {localizedItems[active].newBars.includes(i) && (
            <img className="sc-info-bar-new" src={newsign} alt="" />
          )}
          <div className="sc-info-bar">
            <span className="sc-info-bar-text">{formatInfoText(localizedItems[active].links[i])}</span>
          </div>
        </button>
      ))}

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span><span>{copy.footer.select}</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span><span>{copy.footer.open}</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span><span>{copy.footer.back}</span></div>
      </div>
    </div>
  );
}