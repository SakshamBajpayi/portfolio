import React from 'react';

/* ═══════════════════════════════════════════════════════════════
   GEOMETRIC LAYER — Visual DNA of Saksham's Portfolio
   8 Primitive Shapes + HeroCluster Composition + RecurringTriangle
   ═══════════════════════════════════════════════════════════════ */

// ── Shared Types ──
interface BaseShapeProps {
  className?: string;
  style?: React.CSSProperties;
}

// ═════════════════════════════════════════════════════
// 1. SHARD — Filled SVG polygon, aggressive angles
// ═════════════════════════════════════════════════════
interface ShardProps extends BaseShapeProps {
  points: string;
  color?: string;
  size?: number;
  rotation?: number;
  opacity?: number;
}

export const Shard: React.FC<ShardProps> = ({
  points,
  color = 'var(--accent-yellow)',
  size = 100,
  rotation = 0,
  opacity = 1,
  className = '',
  style,
}) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className}`}
    style={{
      transform: `rotate(${rotation}deg)`,
      ...style,
    }}
  >
    <polygon
      points={points}
      fill={color}
      opacity={opacity}
      filter="url(#roughen)"
    />
  </svg>
);

// ═════════════════════════════════════════════════════
// 2. HATCHING CLUSTER — Dense diagonal parallel lines
//    contained within a clipPath boundary
// ═════════════════════════════════════════════════════
interface HatchingClusterProps extends BaseShapeProps {
  width?: number;
  height?: number;
  clipPathD?: string;
  angle?: number;
  lineCount?: number;
  opacity?: number;
}

export const HatchingCluster: React.FC<HatchingClusterProps> = ({
  width = 120,
  height = 120,
  clipPathD = 'M0,0 L120,0 L120,120 L0,120 Z',
  angle = 45,
  lineCount = 14,
  opacity = 0.8,
  className = '',
  style,
}) => {
  const clipId = React.useId();
  const lines: React.ReactNode[] = [];

  // Calculate diagonal span to ensure full coverage after rotation
  const diag = Math.sqrt(width * width + height * height);
  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < lineCount; i++) {
    // Slightly irregular spacing: base 4px with ±0.8px jitter
    const baseSpacing = 4;
    const jitter = ((i * 7 + 3) % 5 - 2) * 0.4; // deterministic pseudo-random
    const offset = (i - lineCount / 2) * (baseSpacing + jitter);

    // Slightly irregular line length
    const lengthJitter = ((i * 13 + 5) % 7 - 3) * 2;
    const halfLen = diag / 2 + lengthJitter;

    // Line thickness variation: 1-1.5px
    const strokeW = 1 + ((i * 11 + 2) % 3) * 0.25;

    lines.push(
      <line
        key={i}
        x1={cx - halfLen}
        y1={cy + offset}
        x2={cx + halfLen}
        y2={cy + offset}
        stroke="var(--geo-black)"
        strokeWidth={strokeW}
        strokeLinecap="butt"
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={clipPathD} />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${clipId})`}
        opacity={opacity}
      >
        <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
          {lines}
        </g>
      </g>
    </svg>
  );
};

// ═════════════════════════════════════════════════════
// 3. CONSTRUCTION LINE — 1px line with arrow tick
// ═════════════════════════════════════════════════════
interface ConstructionLineProps extends BaseShapeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}

export const ConstructionLine: React.FC<ConstructionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = 'var(--geo-black)',
  className = '',
  style,
}) => {
  // Calculate angle for the arrow tick at end
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const tickLen = 6;

  // Two tick lines forming a small arrowhead
  const t1x = x2 - tickLen * Math.cos(angle - 0.5);
  const t1y = y2 - tickLen * Math.sin(angle - 0.5);
  const t2x = x2 - tickLen * Math.cos(angle + 0.5);
  const t2y = y2 - tickLen * Math.sin(angle + 0.5);

  // Bounding box
  const allX = [x1, x2, t1x, t2x];
  const allY = [y1, y2, t1y, t2y];
  const minX = Math.min(...allX) - 2;
  const minY = Math.min(...allY) - 2;
  const maxX = Math.max(...allX) + 2;
  const maxY = Math.max(...allY) + 2;

  return (
    <svg
      aria-hidden="true"
      width={maxX - minX}
      height={maxY - minY}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={1}
        opacity={0.5}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        className="hero-construction-line"
      />
      <line
        x1={x2} y1={y2} x2={t1x} y2={t1y}
        stroke={color}
        strokeWidth={1}
        opacity={0.5}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        className="hero-construction-line"
      />
      <line
        x1={x2} y1={y2} x2={t2x} y2={t2y}
        stroke={color}
        strokeWidth={1}
        opacity={0.5}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        className="hero-construction-line"
      />
    </svg>
  );
};

// ═════════════════════════════════════════════════════
// 4. AXIS CROSS — Thin + shape
// ═════════════════════════════════════════════════════
interface AxisCrossProps extends BaseShapeProps {
  size?: number;
  color?: string;
  x?: number;
  y?: number;
}

export const AxisCross: React.FC<AxisCrossProps> = ({
  size = 16,
  color = 'var(--geo-black)',
  x = 0,
  y = 0,
  className = '',
  style,
}) => {
  const half = size / 2;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ position: 'absolute', left: x - half, top: y - half, ...style }}
    >
      {/* Horizontal */}
      <line
        x1={0} y1={half}
        x2={size} y2={half}
        stroke={color}
        strokeWidth={1}
        opacity={0.45}
      />
      {/* Vertical */}
      <line
        x1={half} y1={0}
        x2={half} y2={size}
        stroke={color}
        strokeWidth={1}
        opacity={0.45}
      />
    </svg>
  );
};

// ═════════════════════════════════════════════════════
// 5. CORNER BRACKET — L-shaped bracket fragment
// ═════════════════════════════════════════════════════
interface CornerBracketProps extends BaseShapeProps {
  size?: number;
  rotation?: number;
  color?: string;
  x?: number;
  y?: number;
}

export const CornerBracket: React.FC<CornerBracketProps> = ({
  size = 18,
  rotation = 0,
  color = 'var(--geo-black)',
  x = 0,
  y = 0,
  className = '',
  style,
}) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    className={className}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `rotate(${rotation}deg)`,
      ...style,
    }}
  >
    <polyline
      points={`${size * 0.8},0 0,0 0,${size * 0.8}`}
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      opacity={0.55}
    />
  </svg>
);

// ═════════════════════════════════════════════════════
// 6. FRAGMENT RECT — Rotated rectangle, partially clipped
// ═════════════════════════════════════════════════════
interface FragmentRectProps extends BaseShapeProps {
  width?: number;
  height?: number;
  color?: string;
  rotation?: number;
  x?: number;
  y?: number;
  opacity?: number;
}

export const FragmentRect: React.FC<FragmentRectProps> = ({
  width = 60,
  height = 40,
  color = 'var(--accent-purple)',
  rotation = 20,
  x = 0,
  y = 0,
  opacity = 0.85,
  className = '',
  style,
}) => (
  <svg
    aria-hidden="true"
    width={width + 20}
    height={height + 20}
    viewBox={`0 0 ${width + 20} ${height + 20}`}
    className={className}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      overflow: 'hidden',
      ...style,
    }}
  >
    <rect
      x={10}
      y={10}
      width={width}
      height={height}
      fill={color}
      opacity={opacity}
      rx={0}
      transform={`rotate(${rotation}, ${width / 2 + 10}, ${height / 2 + 10})`}
      filter="url(#roughen)"
    />
  </svg>
);

// ═════════════════════════════════════════════════════
// 7. NODE DOT — 4-8px solid circle
// ═════════════════════════════════════════════════════
interface NodeDotProps extends BaseShapeProps {
  size?: number;
  color?: string;
  x?: number;
  y?: number;
}

export const NodeDot: React.FC<NodeDotProps> = ({
  size = 6,
  color = 'var(--geo-black)',
  x = 0,
  y = 0,
  className = '',
  style,
}) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    className={className}
    style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, ...style }}
  >
    <circle
      cx={size / 2}
      cy={size / 2}
      r={size / 2}
      fill={color}
    />
  </svg>
);

// ═════════════════════════════════════════════════════
// 8. VELOCITY STREAK — Thin elongated triangle, motion blur
// ═════════════════════════════════════════════════════
interface VelocityStreakProps extends BaseShapeProps {
  length?: number;
  angle?: number;
  color?: string;
  x?: number;
  y?: number;
}

export const VelocityStreak: React.FC<VelocityStreakProps> = ({
  length = 60,
  angle = -30,
  color = 'var(--accent-magenta)',
  x = 0,
  y = 0,
  className = '',
  style,
}) => {
  // Elongated triangle: narrow base, long tip
  const baseHalf = 3;
  const points = `0,${baseHalf} ${length},0 0,${-baseHalf}`;

  return (
    <svg
      aria-hidden="true"
      width={length + 4}
      height={baseHalf * 2 + 4}
      viewBox={`-2 ${-baseHalf - 2} ${length + 4} ${baseHalf * 2 + 4}`}
      className={className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0% 50%',
        ...style,
      }}
    >
      <polygon
        points={points}
        fill={color}
        opacity={0.7}
      />
    </svg>
  );
};

// ═════════════════════════════════════════════════════
// RECURRING YELLOW TRIANGLE — Reappears across sections
// ═════════════════════════════════════════════════════
interface RecurringTriangleProps extends BaseShapeProps {
  size?: number;
  filled?: boolean;
  color?: string;
  rotation?: number;
}

export const RecurringTriangle: React.FC<RecurringTriangleProps> = ({
  size = 80,
  filled = true,
  color = 'var(--accent-yellow)',
  rotation = -15,
  className = '',
  style,
}) => {
  // Upward-right pointing triangle with slight asymmetry
  const points = `${size * 0.12},${size * 0.88} ${size * 0.92},${size * 0.72} ${size * 0.38},${size * 0.08}`;

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`recurring-triangle ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        ...style,
      }}
    >
      <polygon
        points={points}
        fill={filled ? color : 'none'}
        stroke={filled ? 'none' : color}
        strokeWidth={filled ? 0 : 2}
        filter="url(#roughen)"
      />
    </svg>
  );
};

// ═════════════════════════════════════════════════════
// SVG FILTER DEFINITIONS — roughen edge quality
// ═════════════════════════════════════════════════════
const SvgFilters: React.FC = () => (
  <svg
    aria-hidden="true"
    className="svg-defs-global"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
  >
    <defs>
      <filter id="roughen">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves={2}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={2}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

// ═════════════════════════════════════════════════════
// HERO CLUSTER — Main geometric explosion composition
// ═════════════════════════════════════════════════════
interface HeroClusterProps extends BaseShapeProps {}

const HeroCluster: React.FC<HeroClusterProps> = ({
  className = '',
  style,
}) => {
  return (
    <div
      className={`hero-cluster ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: '55%',
        width: '480px',
        height: '520px',
        transform: 'scale(2)',
        transformOrigin: 'top right',
        overflow: 'visible',
        ...style,
      }}
    >
      {/* ── SVG Filter Definitions ── */}
      <SvgFilters />

      {/* ══════════════════════════════════════════
          LAYER 1 — Large Shards (back-most)
          ══════════════════════════════════════════ */}

      {/* Large accent-yellow shard ~180px */}
      <Shard
        points="8,78 52,5 95,32 88,92 35,98"
        color="var(--accent-yellow)"
        size={180}
        rotation={12}
        opacity={0.92}
        className="blend-multiply"
        style={{ position: 'absolute', left: 140, top: 100 }}
      />

      {/* Large accent-magenta shard ~220px */}
      <Shard
        points="15,65 58,3 97,28 82,95 25,88"
        color="var(--accent-magenta)"
        size={220}
        rotation={-8}
        opacity={0.88}
        className="blend-multiply"
        style={{ position: 'absolute', left: 220, top: 60 }}
      />

      {/* ══════════════════════════════════════════
          LAYER 2 — Fragment Rectangles
          ══════════════════════════════════════════ */}

      {/* Large accent-purple fragment, rotated ~20deg */}
      <FragmentRect
        width={130}
        height={75}
        color="var(--accent-purple)"
        rotation={20}
        x={100}
        y={180}
        opacity={0.82}
        className="blend-multiply"
      />

      {/* Smaller ink fragment */}
      <FragmentRect
        width={55}
        height={32}
        color="var(--ink)"
        rotation={-25}
        x={280}
        y={140}
        opacity={0.6}
        className="blend-multiply"
      />

      {/* Small accent-cyan fragment */}
      <FragmentRect
        width={40}
        height={24}
        color="var(--accent-cyan)"
        rotation={18}
        x={60}
        y={310}
        opacity={0.75}
        className="blend-multiply"
      />

      {/* Dark teal overlap fragment */}
      <FragmentRect
        width={65}
        height={38}
        color="var(--accent-teal)"
        rotation={-15}
        x={210}
        y={300}
        opacity={0.7}
        className="blend-multiply"
      />

      {/* ══════════════════════════════════════════
          LAYER 3 — Hatching Clusters
          ══════════════════════════════════════════ */}

      {/* Hatching inside yellow shard area */}
      <div
        className="blend-multiply"
        style={{ position: 'absolute', left: 165, top: 130 }}
      >
        <HatchingCluster
          width={100}
          height={90}
          clipPathD="M8,72 L45,5 L92,28 L85,82 Z"
          angle={42}
          lineCount={16}
          opacity={0.78}
        />
      </div>

      {/* Hatching across magenta shard */}
      <div
        className="blend-multiply"
        style={{ position: 'absolute', left: 260, top: 85 }}
      >
        <HatchingCluster
          width={130}
          height={110}
          clipPathD="M10,55 L55,3 L125,25 L110,100 L20,95 Z"
          angle={48}
          lineCount={20}
          opacity={0.72}
        />
      </div>

      {/* Floating hatching cluster */}
      <div
        className="blend-multiply"
        style={{ position: 'absolute', left: 370, top: 250 }}
      >
        <HatchingCluster
          width={80}
          height={70}
          clipPathD="M5,5 L75,8 L72,65 L8,62 Z"
          angle={38}
          lineCount={12}
          opacity={0.85}
        />
      </div>

      {/* ══════════════════════════════════════════
          LAYER 4 — Construction Lines (radiating)
          ══════════════════════════════════════════ */}
      {[
        { x1: 240, y1: 260, x2: 380, y2: 180 },
        { x1: 240, y1: 260, x2: 400, y2: 260 },
        { x1: 240, y1: 260, x2: 370, y2: 340 },
        { x1: 240, y1: 260, x2: 280, y2: 420 },
        { x1: 240, y1: 260, x2: 140, y2: 410 },
        { x1: 240, y1: 260, x2: 80, y2: 320 },
        { x1: 240, y1: 260, x2: 60, y2: 200 },
        { x1: 240, y1: 260, x2: 100, y2: 100 },
        { x1: 240, y1: 260, x2: 180, y2: 70 },
        { x1: 240, y1: 260, x2: 320, y2: 90 },
        { x1: 240, y1: 260, x2: 420, y2: 130 },
        { x1: 240, y1: 260, x2: 430, y2: 310 },
      ].map((line, i) => (
        <div
          key={`cl-${i}`}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
          <ConstructionLine
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            color="var(--geo-black)"
          />
        </div>
      ))}

      {/* ══════════════════════════════════════════
          LAYER 5 — Node Dots at intersections
          ══════════════════════════════════════════ */}
      <NodeDot x={240} y={260} size={7} color="var(--geo-black)" />
      <NodeDot x={165} y={155} size={5} color="var(--accent-magenta)" />
      <NodeDot x={310} y={180} size={5} color="var(--geo-black)" />
      <NodeDot x={195} y={340} size={6} color="var(--accent-purple)" />

      {/* ══════════════════════════════════════════
          LAYER 6 — Velocity Streaks
          ══════════════════════════════════════════ */}
      <VelocityStreak
        length={70}
        angle={-32}
        color="var(--accent-magenta)"
        x={340}
        y={80}
      />
      <VelocityStreak
        length={50}
        angle={-25}
        color="var(--accent-orange)"
        x={370}
        y={55}
        style={{ opacity: 0.6 }}
      />

      {/* ══════════════════════════════════════════
          LAYER 7 — Axis Cross near center
          ══════════════════════════════════════════ */}
      <AxisCross
        size={18}
        color="var(--geo-black)"
        x={240}
        y={260}
      />

      {/* ══════════════════════════════════════════
          LAYER 8 — Corner Brackets (structural accents)
          ══════════════════════════════════════════ */}
      <CornerBracket size={14} rotation={0} color="var(--geo-black)" x={72} y={92} />
      <CornerBracket size={14} rotation={180} color="var(--geo-black)" x={380} y={370} />

      {/* ══════════════════════════════════════════
          LAYER 9 — The RECURRING YELLOW TRIANGLE
          (identifiable, large, upward-right)
          ══════════════════════════════════════════ */}
      <div
        className="blend-multiply"
        style={{ position: 'absolute', left: 190, top: 200 }}
      >
        <RecurringTriangle
          size={110}
          filled={true}
          color="var(--accent-yellow)"
          rotation={-12}
        />
      </div>

      {/* ══════════════════════════════════════════
          LAYER 10 — Typographic Labels (Amatic SC)
          ══════════════════════════════════════════ */}
      <div
        className="font-accent"
        style={{
          position: 'absolute',
          left: 110,
          top: 190,
          fontSize: '8px',
          fontWeight: 700,
          color: '#6B6560',
          opacity: 0.8,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
          transform: 'rotate(-5deg)',
        }}
      >
        <div>{'// idea'}</div>
        <div>{'// experiment'}</div>
        <div>{'// repeat'}</div>
      </div>

      <span
        className="font-accent"
        style={{
          position: 'absolute',
          right: 40,
          bottom: 55,
          fontSize: '7px',
          fontWeight: 700,
          color: 'var(--ink-muted)',
          letterSpacing: '0.12em',
          opacity: 0.8,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        fig. 01
      </span>
    </div>
  );
};

export { HeroCluster, SvgFilters };
export default HeroCluster;
