"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BRAND_COLORS,
  BRAND_RGBA,
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_TICK_FILL,
} from "@/lib/brand/colors";
import type { ProviderTrendPoint } from "@/lib/provider/compute-metrics";

type AdminOrderVolumeChartProps = {
  data: ProviderTrendPoint[];
  compact?: boolean;
};

function formatAxisDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AdminOrderVolumeChart({ data, compact = false }: AdminOrderVolumeChartProps) {
  return (
    <div className={`w-full ${compact ? "h-52" : "h-72"}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="adminOrderVolumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND_RGBA.pacificTeal35} />
              <stop offset="100%" stopColor={BRAND_RGBA.pacificTeal08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
          <XAxis
            dataKey="date"
            tickFormatter={formatAxisDate}
            tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
            axisLine={{ stroke: CHART_AXIS_STROKE }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
            axisLine={{ stroke: CHART_AXIS_STROKE }}
          />
          <Tooltip
            formatter={(value) => [Number(value ?? 0).toLocaleString(), "Orders"]}
            labelFormatter={(label) => formatAxisDate(String(label))}
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${CHART_AXIS_STROKE}`,
              background: BRAND_COLORS.pureWhite,
            }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke={BRAND_COLORS.pacificTeal}
            strokeWidth={2}
            fill="url(#adminOrderVolumeFill)"
            dot={{ r: 2, fill: BRAND_COLORS.pacificTeal }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
