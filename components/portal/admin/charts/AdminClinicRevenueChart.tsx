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
  CHART_AXIS_STROKE,
  CHART_COLORS,
  CHART_GRID_STROKE,
  CHART_TICK_FILL,
} from "@/lib/brand/colors";
import { formatCurrency } from "@/lib/format/currency";
import type { AdminClinicRevenueRow } from "@/lib/admin/dashboard-charts";

type AdminClinicRevenueChartProps = {
  data: AdminClinicRevenueRow[];
  compact?: boolean;
};

function formatAxisCurrency(value: number) {
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${value}`;
}

export function AdminClinicRevenueChart({ data, compact = false }: AdminClinicRevenueChartProps) {
  const chartData = [...data]
    .slice(0, 6)
    .map((row) => ({
      ...row,
      shortName:
        row.clinicName.length > 16 ? `${row.clinicName.slice(0, 16)}…` : row.clinicName,
    }));

  return (
    <div className={`w-full ${compact ? "h-52" : "h-80"}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="shortName"
            tick={{ fill: CHART_TICK_FILL, fontSize: 10 }}
            axisLine={{ stroke: CHART_AXIS_STROKE }}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={72}
          />
          <YAxis
            tickFormatter={formatAxisCurrency}
            tick={{ fill: CHART_TICK_FILL, fontSize: 11 }}
            axisLine={{ stroke: CHART_AXIS_STROKE }}
            width={48}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value ?? 0)), "GMV"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.clinicName ?? ""}
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${CHART_AXIS_STROKE}`,
              background: BRAND_COLORS.pureWhite,
            }}
          />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {chartData.map((entry, index) => (
              <Cell key={entry.clinicId} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
