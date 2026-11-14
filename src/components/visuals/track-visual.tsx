import type { CSSProperties } from "react";
import type { TrackId } from "@/content/site";

type TrackVisualProps = {
  track: TrackId;
  className?: string;
};

const stroke = { stroke: "var(--tc)" } satisfies CSSProperties;
const fill = { fill: "var(--tc)" } satisfies CSSProperties;
const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

function CodeVisual() {
  const lines: { x: number; w: number; o: number }[][] = [
    [{ x: 0, w: 46, o: 1 }, { x: 54, w: 70, o: 0.45 }],
    [{ x: 16, w: 90, o: 0.45 }, { x: 114, w: 40, o: 1 }],
    [{ x: 16, w: 56, o: 1 }, { x: 80, w: 100, o: 0.45 }],
    [{ x: 32, w: 120, o: 0.45 }],
    [{ x: 16, w: 30, o: 1 }, { x: 54, w: 64, o: 0.45 }],
    [{ x: 0, w: 22, o: 0.45 }],
  ];
  return (
    <svg viewBox="0 0 400 240" fill="none" aria-hidden className="h-full w-full">
      <rect x="40" y="28" width="320" height="184" rx="16" className="fill-black/40" style={stroke} strokeOpacity="0.5" />
      <path d="M40 60H360" style={stroke} strokeOpacity="0.3" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={62 + i * 16} cy="44" r="4.5" style={fill} opacity={0.9 - i * 0.28} />
      ))}
      <text x="316" y="49" fontSize="12" style={fill} opacity="0.7" fontFamily="monospace">
        app.tsx
      </text>
      {lines.map((row, i) =>
        row.map((seg, j) => (
          <rect
            key={`${i}-${j}`}
            className="v-line"
            style={{ ...fill, animationDelay: `${i * 0.35 + j * 0.15}s` }}
            x={64 + seg.x}
            y={78 + i * 21}
            width={seg.w}
            height="8"
            rx="4"
            opacity={seg.o}
          />
        )),
      )}
      <rect className="caret" x="150" y="186" width="9" height="14" rx="2" style={fill} />
      <text x="262" y="196" fontSize="64" fontWeight="700" style={fill} opacity="0.18" fontFamily="monospace" className="v-float">
        {"</>"}
      </text>
    </svg>
  );
}

function DesignVisual() {
  return (
    <svg viewBox="0 0 400 240" fill="none" aria-hidden className="h-full w-full">
      <path className="v-draw" d="M40 190C100 40 160 40 200 120S300 210 360 60" style={stroke} strokeWidth="5" strokeLinecap="round" />
      <path className="v-dash" d="M40 190L100 70M360 60L310 170" style={stroke} strokeOpacity="0.6" />
      {[
        [40, 190],
        [200, 120],
        [360, 60],
      ].map(([cx, cy]) => (
        <rect key={`${cx}`} x={cx - 6} y={cy - 6} width="12" height="12" rx="2" className="fill-background" style={stroke} strokeWidth="2.5" />
      ))}
      {[
        [100, 70],
        [310, 170],
      ].map(([cx, cy]) => (
        <circle key={`${cx}`} className="v-pulse" cx={cx} cy={cy} r="6" style={fill} />
      ))}
      <g className="v-float">
        <circle cx="86" cy="196" r="15" style={fill} opacity="0.95" />
        <circle cx="116" cy="204" r="15" style={fill} opacity="0.6" />
        <circle cx="146" cy="196" r="15" style={fill} opacity="0.3" />
      </g>
      <g className="v-float" style={delay(-2)}>
        <rect x="262" y="96" width="76" height="52" rx="10" style={stroke} strokeWidth="2" strokeDasharray="5 5" />
        <path d="M290 120l30 12-12 4-4 12z" className="fill-foreground" />
      </g>
    </svg>
  );
}

function MarketingVisual() {
  const heights = [52, 78, 66, 108, 92, 142];
  return (
    <svg viewBox="0 0 400 240" fill="none" aria-hidden className="h-full w-full">
      <path d="M40 206H360" style={stroke} strokeOpacity="0.35" />
      {heights.map((h, i) => (
        <rect
          key={i}
          className="v-bar"
          style={{ ...fill, animationDelay: `${i * 0.18}s` }}
          x={62 + i * 50}
          y={206 - h}
          width="30"
          height={h}
          rx="7"
          opacity={0.35 + i * 0.13}
        />
      ))}
      <path className="v-draw" d="M70 160L120 130L170 144L220 96L270 108L330 44" style={stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="v-pulse" cx="330" cy="44" r="9" style={fill} />
      <g className="v-float">
        <rect x="52" y="34" width="86" height="34" rx="17" style={stroke} strokeWidth="2" className="fill-black/40" />
        <circle cx="72" cy="51" r="6" style={fill} />
        <rect x="86" y="46" width="40" height="10" rx="5" style={fill} opacity="0.5" />
      </g>
    </svg>
  );
}

function AiVisual() {
  const layers = [
    [60, 120, 180],
    [40, 90, 150, 200],
    [75, 150],
  ];
  const xs = [90, 200, 310];
  return (
    <svg viewBox="0 0 400 240" fill="none" aria-hidden className="h-full w-full">
      {layers[0].flatMap((a) =>
        layers[1].map((b) => (
          <path key={`a${a}-${b}`} className="v-dash" d={`M${xs[0]} ${a}L${xs[1]} ${b}`} style={stroke} strokeOpacity="0.35" />
        )),
      )}
      {layers[1].flatMap((a) =>
        layers[2].map((b) => (
          <path key={`b${a}-${b}`} className="v-dash" d={`M${xs[1]} ${a}L${xs[2]} ${b}`} style={stroke} strokeOpacity="0.35" />
        )),
      )}
      {layers.map((ys, li) =>
        ys.map((y, ni) => (
          <circle key={`${li}-${ni}`} className="v-pulse" style={{ ...fill, animationDelay: `${(li * 3 + ni) * 0.22}s` }} cx={xs[li]} cy={y + 8} r={li === 2 ? 11 : 8} />
        )),
      )}
      <path className="v-spin" d="M352 26l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" style={fill} />
      <path className="v-spin" d="M44 190l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" style={fill} opacity="0.6" />
    </svg>
  );
}

function DataAnalysisVisual() {
  const bars = [60, 96, 76, 120];
  return (
    <svg viewBox="0 0 400 240" fill="none" aria-hidden className="h-full w-full">
      <rect x="32" y="26" width="336" height="188" rx="16" className="fill-black/35" style={stroke} strokeOpacity="0.45" />
      <g transform="translate(112 108) rotate(-90)">
        <circle r="46" style={stroke} strokeOpacity="0.2" strokeWidth="16" />
        <circle className="v-draw" r="46" style={stroke} strokeWidth="16" strokeLinecap="round" strokeDasharray="289" strokeDashoffset="70" />
      </g>
      <text x="112" y="116" textAnchor="middle" fontSize="22" fontWeight="700" className="fill-foreground">
        76%
      </text>
      {bars.map((h, i) => (
        <rect key={i} className="v-bar" style={{ ...fill, animationDelay: `${i * 0.25}s` }} x={206 + i * 34} y={190 - h} width="22" height={h} rx="6" opacity={0.4 + i * 0.2} />
      ))}
      <path d="M62 180H174" style={stroke} strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
      <path d="M62 198H130" style={stroke} strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function DataScienceVisual() {
  const pts: [number, number][] = [
    [70, 176], [96, 150], [118, 164], [142, 120], [168, 134], [196, 104],
    [222, 92], [248, 112], [276, 70], [302, 82], [330, 48],
  ];
  return (
    <svg viewBox="0 0 400 240" fill="none" aria-hidden className="h-full w-full">
      <path d="M44 28V208H368" style={stroke} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      {[78, 128, 178].map((y) => (
        <path key={y} d={`M44 ${y}H368`} style={stroke} strokeOpacity="0.12" />
      ))}
      <path className="v-draw" d="M56 186L346 40" style={stroke} strokeWidth="3.5" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} className="v-pulse" style={{ ...fill, animationDelay: `${i * 0.25}s` }} cx={x} cy={y} r="6" opacity="0.9" />
      ))}
      <circle cx="346" cy="40" r="14" style={stroke} strokeWidth="2" className="v-pulse" />
    </svg>
  );
}

export function TrackVisual({ track, className }: TrackVisualProps) {
  let body;
  switch (track) {
    case "programming":
      body = <CodeVisual />;
      break;
    case "design":
      body = <DesignVisual />;
      break;
    case "marketing":
      body = <MarketingVisual />;
      break;
    case "ai":
      body = <AiVisual />;
      break;
    case "data-analysis":
      body = <DataAnalysisVisual />;
      break;
    case "data-science":
      body = <DataScienceVisual />;
      break;
    default: {
      const exhaustive: never = track;
      return exhaustive;
    }
  }
  return <div className={className}>{body}</div>;
}
