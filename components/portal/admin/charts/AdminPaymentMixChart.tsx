"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BRAND_COLORS,
  BRAND_RGBA,
  CHART_AXIS_STROKE,
  CHART_COLORS,
  CHART_GRID_STROKE,
  CHART_TICK_FILL,
} from "@/lib/brand/colors";
import type { AdminPaymentMixSegment } from "@/lib/admin/dashboard-charts";

const PAYMENT_COLORS: Record<string, string> = {
  paid: BRAND_COLORS.pacificTeal,
  pending: BRAND_RGBA.pacificTeal65,
  failed: BRAND_COLORS.coralBlush,
  refunded: BRAND_RGBA.pacificTeal35,
};

type AdminPaymentMixChartProps = {
  data: AdminPaymentMixSegment[];
  compact?: boolean;
};

export function AdminPaymentMixChart({ data, compact = false }: AdminPaymentMixChartProps) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const chartHeight = compact ? "h-44" : "h-72";

  if (data.length === 0) {
    return (
      <div className={`flex ${chartHeight} items-center justify-center`}>
        <p className="text-sm text-deep-teal/50">No payment data to chart yet.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-3 ${compact ? "lg:grid-cols-[minmax(0,1fr)_8.5rem]" : "lg:grid-cols-[minmax(0,1fr)_9.5rem]"} lg:items-center`}>
      <div className={`${chartHeight} w-full min-w-0`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
              axisLine={{ stroke: CHART_AXIS_STROKE }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
              axisLine={{ stroke: CHART_AXIS_STROKE }}
              width={36}
            />
            <Tooltip
              formatter={(value, _name, item) => {
                const count = Number(value ?? 0);
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                return [`${count} orders (${percent}%)`, item.payload?.label ?? "Orders"];
              }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${CHART_AXIS_STROKE}`,
                background: BRAND_COLORS.pureWhite,
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {data.map((segment, index) => (
                <Cell
                  key={segment.id}
                  fill={PAYMENT_COLORS[segment.id] ?? CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="grid gap-1.5">
        {data.map((segment, index) => {
          const percent = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <li key={segment.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    background:
                      PAYMENT_COLORS[segment.id] ?? CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span className="truncate text-deep-teal/70">{segment.label}</span>
              </div>
              <span className="shrink-0 font-medium tabular-nums text-deep-teal">
                {segment.value}{" "}
                <span className="font-normal text-deep-teal/45">({percent}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
