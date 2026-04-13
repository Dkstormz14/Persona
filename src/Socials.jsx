import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main3.mp4"; // Updated to the background from code 1
import newsign from "./assets/newsign.png";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";

// 1. Added Localization support from Code 1
const SOCIALS_COPY = {
  fr: {
    labels: ["LINKEDIN", "INSTAGRAM", "TIKTOK"],
    selectLink: "Selectionner lien",
    itemOpen: "Ouvrir",
    itemSelect: "Selectionner",
    footer: { select: "SÉLECTIONNER", open: "OUVRIR", back: "RETOUR" },
  },
  en: {
    labels: ["LINKEDIN", "INSTAGRAM", "TIKTOK"],
    selectLink: "Select link",
    itemOpen: "Open",
    itemSelect: "Select",
    footer: { select: "SELECT", open: "OPEN", back: "BACK" },
  },
};

const CHARS = [char1, char2, char3];

const ROLES = [
  { text: "LEADER", color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
  { text: "PARTY",  color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "PARTY",  color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
];

const ITEMS = [
  {
    id: "linkedin", label: "LINKEDIN", handle: "@davonte-kesse", href: "https://www.linkedin.com/in/davonte-kesse-586258341/", icon: "💼", barIcon: icon1, bars: 1, newBars: [0],
    links: ["linkedin.com/in/davonte-kesse-586258341/"],
  },
  {
    id: "instagram", label: "INSTAGRAM", handle: "@yourhandle", href: "https://instagram.com/yourhandle", icon: "📷", barIcon: icon2, bars: 2, newBars: [1],
    links: ["instagram.com/p/C4xQmRrNk2a", "instagram.com/p/C3wLpBsOj7f"],
  },
  {
    id: "tiktok", label: "TIKTOK", handle: "@yourhandle", href: "https://tiktok.com/@yourhandle", icon: "🎵", barIcon: icon3, bars: 2, newBars: [0],
    links: ["tiktok.com/@yourhandle/video/1", "tiktok.com/@yourhandle/video/2"],
  },
];

export default function Socials({ lang = "fr" }) {
  const locale = lang === "en" ? "en" : "fr";
  const copy = SOCIALS_COPY[locale];
  
  // 2. Localized items using useMemo
  const localizedItems = useMemo(
    () => ITEMS.map((item, index) => ({
      ...item,
      label: copy.labels[index],
    })),
    [copy.labels]
  );

  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeInfoBar, setActiveInfoBar] = useState(0);
  const [focus, setFocus] = useState("left");
  const navigate = useNavigate();

  // 3. Helper to ensure links work correctly (from Code 1)
  const resolveLink = (rawLink) => {
    if (/^(https?:\/\/|mailto:)/i.test(rawLink)) return rawLink;
    return "https://" + rawLink;
  };

  // 4. Text truncation helper
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
      <video src={bgVideo} autoPlay loop muted playsInline className="sc-bg-video" />
      <style>{`
        /* 5. Added more sophisticated CSS from Code 1 */
        .sc-bg-video {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          filter: saturate(1.05) contrast(1.04) brightness(0.96);
          transform: scale(1.01);
        }
        .sc-root {
          position: absolute; inset: 0; z-index: 10; pointer-events: none;
          display: flex; flex-direction: column; align-items: flex-start;
          justify-content: center; gap: 6px;
        }
        .sc-bar {
          position: relative; width: 45vw; height: 64px;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #111; cursor: pointer; pointer-events: all;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          border: 1px solid rgba(255, 210, 48, 0.2);
        }
        .sc-bar-outer {
          position: relative; transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          background: transparent; border: none; padding: 0;
        }
        .sc-bar-outer.mounted { transform: translateX(0); }
        .sc-bar-outer.active .sc-bar { height: 90px; }
        .sc-bar-red {
          position: absolute; top: 0; left: 0; width: 45vw; height: 64px;
          background: #d32828; opacity: 0; transition: opacity 0.2s ease;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
        }
        .sc-bar-outer.active .sc-bar-red { opacity: 1; height: 90px; }
        .sc-bar-fill {
          position: absolute; inset: 0; background: #ffd230;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }
        .sc-char {
          position: absolute; top: 0; left: 110px; height: 100%; z-index: 3;
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }
        .sc-role {
          font-family: 'Bebas Neue', sans-serif; font-size: 50px;
          color: #fff; transform: rotate(-30deg); padding: 0 16px;
        }
        .sc-label { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff; }
        .sc-bar-outer.active .sc-label { color: #111; }
        
        /* 6. Info Bars Styling (Right Side) */
        .sc-info-bar-wrap {
          position: fixed; right: 0; left: 65%;
          top: calc(155px + (var(--info-index) * 52px));
          height: 46px; cursor: pointer; pointer-events: all;
          background: transparent; border: none; z-index: 50;
        }
        .sc-info-bar-wrap.selected .sc-info-bar { background: #fff4cc; border-radius: 7px; }
        .sc-info-bar-text { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #111; padding-left: 15px; }
        
        /* 7. Footer Styling */
        .sc-footer {
          position: fixed; bottom: 20px; right: 28px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif; color: rgba(255, 244, 204, 0.5);
        }
        .sc-footer-key { border: 1px solid rgba(255, 210, 48, 0.35); padding: 1px 6px; margin-right: 5px; }
      `}</style>

      <div className="sc-root">
        {localizedItems.map((item, i) => (
          <button
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => {
              if (active === i) window.open(resolveLink(item.href), "_blank");
              else setActive(i);
            }}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <img className="sc-char" src={CHARS[i]} alt="" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>
                <div className="sc-main">
                  <div className="sc-label">{item.label}</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Bars for Links */}
      {mounted && localizedItems[active].links.map((link, i) => (
        <button
          key={`link-${i}`}
          className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
          style={{ "--info-index": i }}
          onMouseEnter={() => setActiveInfoBar(i)}
          onClick={() => window.open(resolveLink(link), "_blank")}
        >
          {localizedItems[active].newBars.includes(i) && (
             <img className="sc-info-bar-new" src={newsign} alt="" style={{ height: '30px', position: 'absolute', left: '-30px'}} />
          )}
          <div className="sc-info-bar">
            <span className="sc-info-bar-text">{formatInfoText(link)}</span>
          </div>
        </button>
      ))}

      {/* Footer Hints */}
      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span>{copy.footer.select}</div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span>{copy.footer.open}</div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span>{copy.footer.back}</div>
      </div>
    </div>
  );
}