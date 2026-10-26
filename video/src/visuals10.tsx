// More v3 mocks: a Windows laptop that shows a saved Wi-Fi password with its QR code, Quick Share requests from
// strangers on Android, an iPhone map that goes from an exact pin to a rough area, and Mac hot corners that lock the screen.
// The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000, LW = 940, LH = 600;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
type LaptopV = Extract<Visual, { type: "laptop" }>;
const BLUE = "#4da3ff";

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: "#0e1428", border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good, bottom = 60 }: { text: string; good: boolean; bottom?: number }) {
  return <div style={{ position: "absolute", bottom, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 6,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}
function LaptopShell({ children, title }: { children: React.ReactNode; title: string }) {
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{title}</div>
      {children}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
/** A fake but stable QR code (just a pattern, nothing to scan). */
function Qr({ size, o = 1 }: { size: number; o?: number }) {
  const n = 21, c = size / n;
  const on = (x: number, y: number) => { const fin = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x >= a + 2 && x <= a + 4 && y >= b + 2 && y <= b + 4));
    if (x < 8 && y < 8) return fin(0, 0); if (x > 12 && y < 8) return fin(14, 0); if (x < 8 && y > 12) return fin(0, 14); return ((x * 7 + y * 13 + x * y) % 5) < 2; };
  return <div style={{ position: "relative", width: size, height: size, background: "#fff", borderRadius: 10, padding: 10, opacity: o, boxSizing: "content-box" }}>
    {Array.from({ length: n * n }, (_, i) => { const x = i % n, y = Math.floor(i / n); return on(x, y) ? <div key={i} style={{ position: "absolute", left: 10 + x * c, top: 10 + y * c, width: c, height: c, background: "#0b1020" }} /> : null; })}
  </div>;
}

/** action "wifikey" (Windows 11). mode "ask": a new tablet asks for the password, everyone shrugs
 *  | "saved": the known-networks list, the home network glows (it's already saved here)
 *  | "show": the pointer clicks Show next to the Wi-Fi password, it appears with a QR code. */
export function LaptopWifiKey({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "ask";
  if (mode === "ask") {
    const tries = ["sunflower", "Sunflower42!", "password123"]; const t = Math.min(tries.length - 1, Math.floor(f / Math.max(8, dur / 3.2)));
    const shake = f % Math.max(8, Math.floor(dur / 3.2)) < 6 ? Math.sin(f * 2) * 8 : 0;
    return <LaptopShell title="Settings · Network & internet › Wi-Fi">
      <div style={{ position: "absolute", top: 90, left: 120, right: 120, padding: 30, borderRadius: 20, background: "#1c2440", border: `2px solid ${C.warn}`, transform: `translateX(${shake}px)` }}>
        <div style={{ fontFamily: fontSans, fontSize: 30, color: C.mut }}>New tablet wants to join</div>
        <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg, marginTop: 8 }}>📶 Home-5G</div>
        <div style={{ marginTop: 22, padding: "16px 20px", borderRadius: 12, background: "#0f1730", border: "2px solid #3a4670", fontFamily: fontMono, fontSize: 30, color: C.fg }}>{tries[t]}</div>
        <div style={{ marginTop: 14, fontFamily: fontSans, fontSize: 28, color: C.warn }}>Incorrect password</div>
      </div>
      <div style={{ position: "absolute", bottom: 40, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg, textAlign: "center", opacity: p(dur * 0.3, dur * 0.4) }}>
        {v.items?.[0] ?? "Anyone? The sticker's worn off the router."}</div>
    </LaptopShell>;
  }
  const nets = ["Home-5G", "Cafe Guest", "Office-WiFi", "Hotel Lobby"];
  if (mode === "saved") {
    const glow = p(dur * 0.2, dur * 0.4);
    return <LaptopShell title="Settings · Wi-Fi › Manage known networks">
      <div style={{ position: "absolute", top: 66, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>Known networks</div>
      {nets.map((n, i) => <div key={n} style={{ position: "absolute", top: 150 + i * 88, left: 26, right: 26, height: 76, borderRadius: 16, padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: i === 0 && glow > 0.5 ? "rgba(62,224,160,.16)" : C.panel, border: i === 0 && glow > 0.5 ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 32, color: C.fg }}>
        <span>📶 {n}</span><span style={{ fontFamily: fontMono, fontSize: 24, color: i === 0 && glow > 0.5 ? C.acc : C.mut }}>{i === 0 && glow > 0.5 ? "password saved" : "saved"}</span></div>)}
    </LaptopShell>;
  }
  // show
  const move = p(0, dur * 0.3); const press = interpolate(f, [dur * 0.33, dur * 0.39, dur * 0.46], [0, 1, 0], clamp); const shown = p(dur * 0.4, dur * 0.5);
  const btnX = LW - 26 - 26 - 70, btnY = 150 + 88 + 38;
  const fx = interpolate(move, [0, 1], [LW * 0.5, btnX]), fy = interpolate(move, [0, 1], [LH - 80, btnY]);
  const rows: [string, string][] = [["Connect automatically", ""], ["Wi-Fi network password", "show"], ["Security type", "WPA2-Personal"]];
  return <LaptopShell title="Settings · Manage known networks › Home-5G">
    <div style={{ position: "absolute", top: 66, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>Home-5G</div>
    {rows.map(([r, val], i) => { const hit = i === 1;
      return <div key={r} style={{ position: "absolute", top: 150 + i * 88, left: 26, right: shown > 0.5 ? 330 : 26, height: 76, borderRadius: 16, padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: hit && shown > 0.5 ? "rgba(62,224,160,.16)" : C.panel, border: hit && shown > 0.5 ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 30, color: C.fg }}>
        <span>{hit && shown > 0.5 ? "sunflower42" : r}</span>
        {hit ? (shown > 0.5 ? <span style={{ fontFamily: fontMono, fontSize: 24, color: C.acc }}>copy</span>
          : <span style={{ padding: "8px 22px", borderRadius: 10, background: press > 0.3 ? C.acc : "#2f3a5e", color: press > 0.3 ? C.bg : C.fg, fontSize: 26, fontWeight: 700 }}>Show</span>)
          : <span style={{ color: C.mut, fontSize: 26 }}>{val}</span>}
      </div>; })}
    {shown > 0 && <div style={{ position: "absolute", top: 140, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: shown }}>
      <Qr size={240} /><div style={{ fontFamily: fontMono, fontSize: 22, color: C.acc }}>scan to join</div></div>}
    {shown < 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={press} show={p(0, 6)} /></div>}
  </LaptopShell>;
}

/** mode "share" (Android, Quick Share). (no reveal) share requests from strangers keep popping up
 *  | "contacts" visibility flips from Everyone to Contacts, and the screen stays quiet. */
export function PhoneShare({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const reqs = [["Galaxy S23", "hey 😉.jpg"], ["Pixel 8", "IMG_4471.jpg"], ["Unknown phone", "free_gift.apk"]];
    const step = Math.max(8, dur / 3.4); const shown = Math.min(reqs.length, 1 + Math.floor(f / step));
    return <Frame label="12:41 · train">
      <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 46, color: C.fg }}>Quick Share</div>
      {reqs.slice(0, shown).map(([who, file], i) => { const o = interpolate(f, [i * step, i * step + 6], [0, 1], clamp);
        return <div key={who} style={{ position: "absolute", top: 230 + i * 190, left: 26, right: 26, padding: "22px 24px", borderRadius: 22, background: "#1c2440", border: `2px solid ${i === 2 ? C.warn : "#3a4670"}`, opacity: o, transform: `translateY(${(1 - o) * -40}px)` }}>
          <div style={{ fontFamily: fontSans, fontSize: 28, color: C.mut }}>{who} wants to share</div>
          <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 34, color: C.fg, marginTop: 6 }}>{file}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "flex-end" }}>
            <div style={{ padding: "10px 22px", borderRadius: 20, background: "#2a3354", fontFamily: fontSans, fontSize: 26, color: C.fg }}>Decline</div>
            <div style={{ padding: "10px 22px", borderRadius: 20, background: BLUE, fontFamily: fontSans, fontSize: 26, color: "#fff" }}>Accept</div></div>
        </div>; })}
      {f > dur * 0.6 && <Note text={v.note ?? "Who even is this?"} good={false} />}
    </Frame>;
  }
  // contacts: the visibility picker flips, then a quiet screen
  const flip = p(dur * 0.25, dur * 0.4);
  const opts = ["Your devices", "Contacts", "Everyone"]; const sel = flip > 0.5 ? 1 : 2;
  return <Frame label="Quick Share">
    <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 46, color: C.fg }}>Who can share</div>
    {opts.map((o, i) => <div key={o} style={{ position: "absolute", top: 240 + i * 110, left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center", gap: 22,
      background: i === sel ? (i === 1 ? "rgba(62,224,160,.16)" : "rgba(255,107,107,.14)") : C.panel, border: `3px solid ${i === sel ? (i === 1 ? C.acc : C.warn) : "transparent"}`, fontFamily: fontSans, fontSize: 36, color: C.fg }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, border: `4px solid ${i === sel ? (i === 1 ? C.acc : C.warn) : C.mut}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {i === sel && <div style={{ width: 20, height: 20, borderRadius: 10, background: i === 1 ? C.acc : C.warn }} />}</div>{o}</div>)}
    <Finger x={PW * 0.4} y={240 + 110 + 46} press={interpolate(f, [dur * 0.22, dur * 0.28, dur * 0.36], [0, 1, 0], clamp)} show={1 - p(dur * 0.5, dur * 0.6)} />
    {flip > 0.5 && <Note text={v.note ?? "Strangers can't even ask now."} good />}
  </Frame>;
}

/** mode "loc" (iPhone). (no reveal) an app's map with a pin on your exact building | "off" the pin melts into a wide rough circle. */
export function PhoneLoc({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const off = v.reveal === "off" ? p(dur * 0.2, dur * 0.55) : 0;
  const cx = PW / 2, cy = 480;
  const pulse = 1 + 0.15 * Math.sin(f / 4);
  return <Frame>
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 70, background: "#141c36", display: "flex", alignItems: "center", padding: "0 30px", fontFamily: fontSans, fontWeight: 700, fontSize: 32, color: C.fg, zIndex: 3 }}>🏷 CouponCity</div>
    <div style={{ position: "absolute", top: 140, left: 0, right: 0, bottom: 0, background: "#16203c",
      backgroundImage: "repeating-linear-gradient(0deg, #22305a 0 10px, transparent 10px 120px), repeating-linear-gradient(90deg, #22305a 0 10px, transparent 10px 140px)" }}>
      {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + (i % 4) * 140, top: 20 + Math.floor(i / 4) * 120, width: 100, height: 82, borderRadius: 8, background: "#1d2950" }} />)}
    </div>
    {off < 1 && <div style={{ position: "absolute", left: cx - 50, top: cy - 50, width: 100, height: 82, borderRadius: 8, background: `rgba(255,107,107,${0.5 * (1 - off)})`, border: `3px solid ${C.warn}`, opacity: 1 - off }} />}
    {off < 1 && <div style={{ position: "absolute", left: cx - 22, top: cy - 26, width: 44, height: 44, borderRadius: 22, background: BLUE, border: "6px solid #fff", transform: `scale(${pulse})`, opacity: 1 - off, boxShadow: `0 0 30px ${BLUE}` }} />}
    {off > 0 && <div style={{ position: "absolute", left: cx - 230 * off, top: cy - 230 * off, width: 460 * off, height: 460 * off, borderRadius: "50%", background: "rgba(77,163,255,.22)", border: `3px solid ${BLUE}`, opacity: off }} />}
    <div style={{ position: "absolute", top: 160, left: 30, right: 30, padding: "16px 22px", borderRadius: 16, background: "#0e1428ee", border: `2px solid ${off > 0.5 ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg, zIndex: 4 }}>
      {off > 0.5 ? "You're: somewhere nearby" : "You're at: 12 Elm St, Flat 3"}</div>
    <Note text={off > 0.5 ? (v.note ?? "Rough area only. Deals still work.") : (v.note ?? "Why does a coupon app need this?")} good={off > 0.5} />
  </Frame>;
}

/** action "corners" (Mac). mode "menu": the slow way, Apple menu > Lock Screen, every time
 *  | "flick": the pointer flicks into the bottom-left corner and the screen locks | "pick": the Hot Corners sheet, bottom-left set to Lock Screen. */
export function LaptopCorners({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "menu";
  const desk = (children: React.ReactNode, locked = 0) => <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "linear-gradient(160deg,#1b2a55,#0f1730)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 36, background: "#141c36cc", display: "flex", alignItems: "center", gap: 26, padding: "0 20px", fontFamily: fontSans, fontSize: 22, color: C.fg }}>
        <span style={{ fontSize: 26 }}>●</span><b>Finder</b><span>File</span><span>Edit</span><span>View</span></div>
      <div style={{ position: "absolute", top: 90, left: 120, width: 520, height: 300, borderRadius: 16, background: "#232c4a", border: "2px solid #3a4670" }}>
        <div style={{ height: 34, borderRadius: "14px 14px 0 0", background: "#2a3354", display: "flex", gap: 10, alignItems: "center", padding: "0 14px" }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}</div>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ margin: "22px 24px 0", width: [420, 340, 380, 260][i], height: 20, borderRadius: 6, background: "#33406a" }} />)}
      </div>
      <div style={{ position: "absolute", bottom: 12, left: LW / 2 - 200, width: 400, height: 64, borderRadius: 20, background: "#ffffff1a", display: "flex", gap: 14, alignItems: "center", justifyContent: "center" }}>
        {["#4da3ff", "#3ee0a0", "#ffc857", "#ff6b6b", "#b28dff"].map((c) => <div key={c} style={{ width: 46, height: 46, borderRadius: 12, background: c }} />)}</div>
      {children}
      {locked > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(6,9,20,${0.92 * locked})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, zIndex: 9 }}>
        <div style={{ fontSize: 80, opacity: locked }}>🔒</div><div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.fg, opacity: locked }}>Locked</div></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
  if (mode === "menu") {
    const items = ["About This Mac", "System Settings…", "Sleep", "Restart…", "Shut Down…", "Lock Screen", "Log Out…"];
    const cyc = dur / 2; const t = (f % cyc) / cyc;
    const open = t > 0.25 && t < 0.85; const toLock = interpolate(t, [0.3, 0.7], [0, 1], { ...clamp, easing: ease });
    const fx = t < 0.25 ? interpolate(t, [0, 0.25], [LW * 0.6, 22], clamp) : 22 + toLock * 90; const fy = t < 0.25 ? interpolate(t, [0, 0.25], [LH * 0.6, 18], clamp) : 18 + toLock * (44 + 5 * 46 + 22);
    return desk(<>
      {open && <div style={{ position: "absolute", top: 36, left: 10, width: 300, borderRadius: 12, background: "#1c2440", border: "2px solid #3a4670", padding: 8, zIndex: 6 }}>
        {items.map((it, i) => <div key={it} style={{ height: 40, marginTop: 6, borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", fontFamily: fontSans, fontSize: 24, color: C.fg, background: i === 5 && toLock > 0.9 ? BLUE : "transparent" }}>{it}</div>)}
      </div>}
      <div style={{ position: "absolute", right: 30, top: 60, padding: "12px 18px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 26, color: C.fg, zIndex: 7, opacity: p(dur * 0.3, dur * 0.4) }}>{`Every. Single. Time. (×${1 + Math.floor(f / cyc)})`}</div>
      <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={t > 0.2 && t < 0.25 || t > 0.72 && t < 0.78 ? 1 : 0} show={1} /></div>
    </>);
  }
  if (mode === "flick") {
    const fl = p(dur * 0.15, dur * 0.3); const locked = p(dur * 0.33, dur * 0.43);
    const fx = interpolate(fl, [0, 1], [LW * 0.6, 4]), fy = interpolate(fl, [0, 1], [LH * 0.4, LH - 4]);
    const hot = fl > 0.95 ? 1 : 0;
    return desk(<>
      <div style={{ position: "absolute", left: -60, bottom: -60, width: 120, height: 120, borderRadius: 60, background: `rgba(62,224,160,${0.15 + 0.45 * hot})`, boxShadow: hot ? `0 0 60px ${C.acc}` : "none" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8, opacity: 1 - locked }}><Finger x={fx} y={fy} press={0} show={1} /></div>
      {locked > 0.5 && <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", zIndex: 10, fontFamily: fontMono, fontSize: 26, color: C.acc }}>bottom-left corner → Lock Screen</div>}
    </>, locked);
  }
  // pick: the Hot Corners sheet
  const set = p(dur * 0.4, dur * 0.5);
  const corners: [string, string, number, number][] = [["Mission Control", "", 40, 70], ["Notification Center", "", LW - 40 - 300, 70], [set > 0.5 ? "Lock Screen" : "–", "bl", 40, LH - 180], ["Quick Note", "", LW - 40 - 300, LH - 180]];
  const move = p(0, dur * 0.35); const lift = p(dur * 0.55, dur * 0.7); // move off the dropdown so "Lock Screen" stays readable
  const fx = interpolate(move, [0, 1], [LW * 0.5, 40 + 150]) + lift * 260, fy = interpolate(move, [0, 1], [LH * 0.45, LH - 180 + 36]) - lift * 120;
  return <LaptopShell title="System Settings · Desktop & Dock › Hot Corners">
    <div style={{ position: "absolute", top: 160, left: LW / 2 - 170, width: 340, height: 200, borderRadius: 14, background: "linear-gradient(160deg,#1b2a55,#0f1730)", border: "3px solid #3a4670" }} />
    {corners.map(([label, id, x, y]) => <div key={x + "-" + y} style={{ position: "absolute", left: x, top: y, width: 300, height: 72, borderRadius: 14, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: id === "bl" && set > 0.5 ? "rgba(62,224,160,.18)" : C.panel, border: `3px solid ${id === "bl" && set > 0.5 ? C.acc : "transparent"}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>
      <span>{label}</span><span style={{ color: C.mut }}>⌄</span></div>)}
    <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={interpolate(f, [dur * 0.36, dur * 0.42, dur * 0.5], [0, 1, 0], clamp)} show={p(0, 6)} /></div>
  </LaptopShell>;
}
