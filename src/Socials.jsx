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
  { text: "LEADER" },
  { text: "PARTY" },
  { text: "PARTY" },
];

const ITEMS = [
  {
    id: "linkedin",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/davonte-kesse-586258341/",
    icon: "🎮",
    barIcon: icon1,
    bars: 1,
    newBars: [0],
    counts: ["56"],
    links: ["twitch.tv/videos/2041837265"],
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    href: "https://instagram.com/yourhandle",
    icon: "📷",
    barIcon: icon2,
    bars: 3,
    newBars: [1],
    counts: ["3.4M", "2.5M", "676K"],
    links: [
      "instagram.com/p/test1",
      "instagram.com/p/test2",
      "instagram.com/p/test3",
    ],
  },
  {
    id: "tiktok",
    label: "TIKTOK",
    href: "https://tiktok.com",
    icon: "🎵",
    barIcon: icon3,
    bars: 2,
    newBars: [0],
    counts: ["5.1M", "3.7M"],
    links: ["tiktok.com/1", "tiktok.com/2"],
  },
];

export default function Socials() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeInfoBar, setActiveInfoBar] = useState(0);
  const [focus, setFocus] = useState("left");
  const navigate = useNavigate();

  const resolveLink = (rawLink) => {
    if (/^(https?:\/\/|mailto:)/i.test(rawLink)) return rawLink;
    return "https://" + rawLink;
  };

  const formatInfoText = (text) => {
    return text.length > 40 ? text.slice(0, 40) + "..." : text;
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

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
        if (e.key === "ArrowUp") setActiveInfoBar(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown") setActiveInfoBar(i => Math.min(ITEMS[active].bars - 1, i + 1));
        if (e.key === "ArrowLeft") setFocus("left");

        if (e.key === "Enter") {
          window.open(resolveLink(ITEMS[active].links[activeInfoBar]), "_blank", "noopener,noreferrer");
        }
      }

      if (e.key === "Escape") navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeInfoBar, focus]);

  return (
    <div className="gto-social-screen">

      {/* 🔥 FIXED VIDEO */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0
        }}
      />

      {/* 🔥 MENU */}
      <div style={{
        position: "absolute",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        left: "20px"
      }}>
        {ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              background: active === i ? "#ffd230" : "#111",
              color: active === i ? "#000" : "#fff",
              padding: "20px 40px",
              cursor: "pointer",
              fontSize: "24px",
              transition: "0.2s"
            }}
            onClick={() => setActive(i)}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      {/* 🔥 INFO PANEL */}
      <div style={{
        position: "absolute",
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10
      }}>
        {Array.from({ length: ITEMS[active].bars }).map((_, i) => (
          <div
            key={i}
            style={{
              background: activeInfoBar === i ? "#fff4cc" : "#222",
              padding: "10px",
              marginBottom: "6px",
              cursor: "pointer"
            }}
            onClick={() => {
              window.open(resolveLink(ITEMS[active].links[i]), "_blank");
            }}
          >
            {formatInfoText(ITEMS[active].links[i])} ({ITEMS[active].counts[i]})
          </div>
        ))}
      </div>

    </div>
  );
}