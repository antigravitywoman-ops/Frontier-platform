"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BRAND_COLORS,
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_SERIES_COLORS,
  CHART_TICK_FILL,
} from "@/lib/brand/colors";
import { formatCurrency } from "@/lib/format/currency";
import type { ProviderTrendPoint } from "@/lib/provider/compute-metrics";
import type { ProviderMetrics } from "@/lib/provider/types";

type ProviderPerformanceChartProps = {
  data: ProviderTrendPoint[];
  metrics: ProviderMetrics;
  rangeLabel?: string;
};

type ChartPoint = ProviderTrendPoint & {
  cumulativeSales: number;
  cumulativeProfit: number;
  cumulativeOrders: number;
};

type SeriesKey = "cumulativeSales" | "cumulativeProfit" | "cumulativeOrders";

const SERIES = [
  {
    key: "cumulativeSales" as const,
    label: "Total sales",
    color: BRAND_COLORS.pacificTeal,
    width: 2.5,
    yAxis: "currency" as const,
    fill: true,
  },
  {
    key: "cumulativeProfit" as const,
    label: "Total profit",
    color: CHART_SERIES_COLORS.tealMid,
    width: 2,
    yAxis: "currency" as const,
    dashed: true,
  },
  {
    key: "cumulativeOrders" as const,
    label: "Order volume",
    color: CHART_SERIES_COLORS.tealSky,
    width: 2,
    yAxis: "count" as const,
  },
] as const;

const KPI_CARDS = [
  { key: "totalSales" as const, label: "Total sales", variant: "sales", format: "currency" as const },
  { key: "totalProfit" as const, label: "Total profit", variant: "profit", format: "currency" as const },
  { key: "orderCount" as const, label: "Orders", variant: "orders", format: "count" as const },
  {
    key: "avgOrderValue" as const,
    label: "Avg order",
    variant: "average",
    format: "currency" as const,
  },
] as const;

function formatAxisDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatKpiValue(value: number, format: "currency" | "count") {
  return format === "currency" ? formatCurrency(value) : value.toLocaleString();
}

function buildChartPoints(data: ProviderTrendPoint[]): ChartPoint[] {
  let cumulativeSales = 0;
  let cumulativeProfit = 0;
  let cumulativeOrders = 0;

  return data.map((point) => {
    cumulativeSales += point.revenue;
    cumulativeProfit += point.profit;
    cumulativeOrders += point.orders;

    return {
      ...point,
      cumulativeSales,
      cumulativeProfit,
      cumulativeOrders,
    };
  });
}

function PerformanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="rounded-xl border border-deep-teal/10 bg-pure-white px-4 py-3 shadow-[0_8px_24px_rgba(1,26,36,0.12)]">
      <p className="text-xs font-medium text-deep-teal/55">{formatAxisDate(String(label))}</p>
      <ul className="mt-2 space-y-1.5">
        {payload.map((entry) => {
          const series = SERIES.find((item) => item.key === entry.dataKey);
          if (!series) return null;
          const formatted =
            series.yAxis === "count"
              ? entry.value.toLocaleString()
              : formatCurrency(entry.value);
          return (
            <li key={entry.dataKey} className="flex items-center gap-2 text-sm text-deep-teal">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-deep-teal/60">{series.label}</span>
              <span className="ml-auto font-medium tabular-nums">{formatted}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const CHART_HEIGHT = 300;

function useChartContainerReady() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      return width > 0 && height > 0;
    };

    if (measure()) {
      setReady(true);
      return;
    }

    const observer = new ResizeObserver(() => {
      if (measure()) {
        setReady(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { containerRef, ready };
}

function PerformanceKpiStrip({ metrics }: { metrics: ProviderMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {KPI_CARDS.map((card) => (
        <div
          key={card.key}
          className={`provider-dash-chart-kpi provider-dash-chart-kpi--${card.variant}`}
        >
          <p className="provider-dash-chart-kpi-label pl-1">{card.label}</p>
          <p className="provider-dash-chart-kpi-value pl-1 tabular-nums">
            {formatKpiValue(metrics[card.key], card.format)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProviderPerformanceChart({
  data,
  metrics,
  rangeLabel,
}: ProviderPerformanceChartProps) {
  const [focusedSeries, setFocusedSeries] = useState<SeriesKey | null>(null);
  const { containerRef, ready } = useChartContainerReady();

  const chartData = useMemo(() => buildChartPoints(data), [data]);

  const hasData = useMemo(
    () => chartData.some((point) => point.cumulativeSales > 0 || point.cumulativeOrders > 0),
    [chartData],
  );

  return (
    <div className="space-y-3">
      <PerformanceKpiStrip metrics={metrics} />

      <div className="provider-dash-chart-canvas">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
          <p className="text-xs font-medium text-deep-teal/50">
            {rangeLabel ? `${rangeLabel} trend` : "Cumulative trend"}
          </p>
          <div className="flex flex-wrap gap-2">
            {SERIES.map((series) => {
              const active = !focusedSeries || focusedSeries === series.key;
              return (
                <button
                  key={series.key}
                  type="button"
                  onClick={() =>
                    setFocusedSeries((current) => (current === series.key ? null : series.key))
                  }
                  className={`provider-dash-chart-legend-btn ${
                    active ? "provider-dash-chart-legend-btn--active" : "opacity-55"
                  }`}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  {series.label}
                </button>
              );
            })}
          </div>
        </div>

        {!hasData ? (
          <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-deep-teal/12 bg-pure-white/60 text-sm text-deep-teal/50">
            No paid orders in this date range yet.
          </div>
        ) : (
          <div ref={containerRef} className="h-72 w-full min-w-0 sm:h-[300px]">
            {ready ? (
              <ResponsiveContainer width="100%" height={CHART_HEIGHT} minWidth={0}>
                <ComposedChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="providerSalesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND_COLORS.pacificTeal} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={BRAND_COLORS.pacificTeal} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    stroke={CHART_GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatAxisDate}
                    tick={{ fill: CHART_TICK_FILL, fontSize: 11, fontFamily: "inherit" }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={32}
                    dy={8}
                  />
                  <YAxis
                    yAxisId="currency"
                    tickFormatter={(value) =>
                      `$${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`
                    }
                    tick={{ fill: CHART_TICK_FILL, fontSize: 11, fontFamily: "inherit" }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    allowDecimals={false}
                    tick={{ fill: CHART_TICK_FILL, fontSize: 11, fontFamily: "inherit" }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    content={<PerformanceTooltip />}
                    cursor={{ stroke: CHART_AXIS_STROKE, strokeWidth: 1 }}
                  />
                  {SERIES.map((series) => {
                    const dimmed = focusedSeries && focusedSeries !== series.key;
                    const yAxisId = series.yAxis === "count" ? "count" : "currency";

                    if ("fill" in series && series.fill) {
                      return (
                        <Area
                          key={series.key}
                          type="monotone"
                          dataKey={series.key}
                          yAxisId={yAxisId}
                          stroke={series.color}
                          strokeWidth={dimmed ? 1.25 : series.width}
                          strokeOpacity={dimmed ? 0.25 : 1}
                          fill="url(#providerSalesFill)"
                          fillOpacity={dimmed ? 0.08 : 1}
                          dot={false}
                          activeDot={{
                            r: 5,
                            fill: series.color,
                            stroke: BRAND_COLORS.pureWhite,
                            strokeWidth: 2,
                          }}
                        />
                      );
                    }

                    return (
                      <Line
                        key={series.key}
                        type="monotone"
                        dataKey={series.key}
                        yAxisId={yAxisId}
                        stroke={series.color}
                        strokeWidth={dimmed ? 1.25 : series.width}
                        strokeOpacity={dimmed ? 0.25 : 1}
                        strokeDasharray={"dashed" in series && series.dashed ? "5 4" : undefined}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: series.color,
                          stroke: BRAND_COLORS.pureWhite,
                          strokeWidth: 2,
                        }}
                      />
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
