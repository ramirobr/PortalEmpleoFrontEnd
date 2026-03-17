"use client";

import { RevenueData, UserGrowthData } from "@/lib/admin/dashboardData";

interface SimpleBarChartProps {
  data: RevenueData[];
  height?: number;
  barColor?: string;
}

export function SimpleBarChart({
  data,
  height = 200,
  barColor = "bg-primary",
}: SimpleBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.amount));

  return (
    <div
      className="w-full flex items-end justify-between gap-2"
      style={{ height }}
    >
      {data.map((item, index) => {
        const heightPercentage = Math.round((item.amount / maxVal) * 100);
        return (
          <div key={index} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full flex justify-center items-end h-full">
              <div
                className={`w-[80%] rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80 ${barColor}`}
                style={{ height: `${heightPercentage}%` }}
              ></div>
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                ${(item.amount / 1000000).toFixed(1)}M
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-2">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}

interface DualLineChartProps {
  data: UserGrowthData[];
  height?: number;
}

export function DualLineChart({ data, height = 200 }: DualLineChartProps) {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.candidates, d.companies)),
  );

  // Helper to normalize values 0-100
  const normalize = (val: number) => Math.round((val / maxVal) * 100);

  // Generate SVG points path
  const createPath = (key: "candidates" | "companies") => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - normalize(d[key]);
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="w-full relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            strokeDasharray="2"
          />
        ))}

        {/* Candidates Line (Blue) */}
        <path
          d={createPath("candidates")}
          fill="none"
          stroke="#3b82f6" // Blue-500
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm"
        />

        {/* Companies Line (Purple) */}
        <path
          d={createPath("companies")}
          fill="none"
          stroke="#a855f7" // Purple-500
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm"
        />
      </svg>

      {/* X Axis Labels */}
      <div className="absolute bottom-[-24px] w-full flex justify-between px-1">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-gray-400 w-8 text-center">
            {d.month}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-[-30px] right-0 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-500">Candidatos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-xs text-gray-500">Empresas</span>
        </div>
      </div>
    </div>
  );
}
