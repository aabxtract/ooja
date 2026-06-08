interface MiniChartProps {
  values: number[];
  tone?: "green" | "red" | "blue";
  height?: number;
}

const strokeByTone = {
  green: "#059669",
  red: "#e11d48",
  blue: "#2563eb",
};

export function MiniChart({ values, tone = "green", height = 92 }: MiniChartProps) {
  const width = 240;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Market price trend"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`chart-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeByTone[tone]} stopOpacity="0.18" />
          <stop offset="100%" stopColor={strokeByTone[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#chart-${tone})`} />
      <polyline
        points={points}
        fill="none"
        stroke={strokeByTone[tone]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}
