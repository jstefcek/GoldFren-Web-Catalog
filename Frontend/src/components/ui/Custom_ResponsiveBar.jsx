import { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTranslation } from "react-i18next";

export function Custom_ResponsiveBar({
  Data = [],
  keys = [],
  indexBy = "",
  axisBottomText = "",
  axisLeftText = "",
  tooltipLabel = "",
  tooltipValueName = "",
  tooltipValueText = "",
  tickValue = undefined,
  groupMode = "stacked",
  showLegend = true,
}) {
  // Init translation hook
  const { t } = useTranslation();

  // Translate axis texts
  const axisBottomLabel = axisBottomText ? t(axisBottomText) : "";
  const axisLeftLabel = axisLeftText ? t(axisLeftText) : "";
  const tooltipLabelText = tooltipLabel ? t(tooltipLabel) : "";
  const tooltipValueLabelText = tooltipValueText ? t(tooltipValueText) : "";
  const tooltipValueNameText = tooltipValueName ? t(tooltipValueName) : "";

  // Same palette as line chart
  const COLOR_PALETTE = [
    "#cc2229",
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ef7ab0",
    "#10b981",
    "#a78bfa",
    "#f97316",
  ];

  // Clean series key by removing trailing numeric indices
  const cleanKey = (key) => String(key ?? "").replace(/\.\d+$/, "");

  // Map bar keys to colors
  const keyColorMap = useMemo(() => {
    const map = {};
    (keys || []).forEach((k, idx) => {
      const ck = cleanKey(k);
      map[ck] = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    });
    return map;
  }, [keys]);

  const normalizedKeys = useMemo(() => (keys || []).map(cleanKey), [keys]);

  // Tooltip helpers
  const getRowLabel = (row) => {
    if (!row) return "";
    const v = row[indexBy];
    return v == null ? "" : String(v);
  };

  const getVal = (row, k) => {
    const v = row?.[k];
    const num = typeof v === "number" ? v : Number(v);
    return Number.isFinite(num) ? num : 0;
  };

  return (
    <ResponsiveBar
      data={Data}
      keys={normalizedKeys}
      indexBy={indexBy}
      groupMode={groupMode}
      padding={0.3}
      labelSkipWidth={20}
      labelSkipHeight={20}
      margin={{ top: 10, right: 30, bottom: showLegend ? 80 : 60, left: 60 }}
      
      // Axis styling + layout aligned to line
      axisBottom={{
        tickSize: 6,
        tickPadding: 10,
        tickRotation: -25,
        tickValues: tickValue,
        legend: axisBottomLabel,
        legendOffset: 50,
      }}
      axisLeft={{
        legend: axisLeftLabel,
        legendOffset: -45,
      }}
      
      // Theme aligned to line
      theme={{
        axis: {
          legend: {
            text: { fontSize: 14, fontWeight: 700, fill: "#111827" },
          },
        },
        tooltip: {
          container: { background: "white", color: "#111827", fontSize: 14 },
        },
      }}
      
      // Colors aligned to line palette & stable mapping
      colors={({ id }) => keyColorMap[cleanKey(id)] ?? COLOR_PALETTE[0]}
      borderColor={{ from: "color", modifiers: [["darker", 0.25]] }}
      
      // Cleaner look
      enableGridY={true}
      enableLabel={false}
      
      // Tooltip aligned to line: white card, title row, sorted series with colored dot
      tooltip={({ indexValue, data }) => {
        const row = data;
        const title = indexValue ?? getRowLabel(row);

        const rows = (normalizedKeys || [])
          .map((k) => ({
            key: k,
            value: getVal(row, k),
            color: keyColorMap[k] ?? "#9CA3AF",
          }))
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

        return (
          <div
            style={{
              background: "white",
              color: "#111827",
              padding: 12,
              borderRadius: 6,
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              minWidth: 260,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
              {tooltipLabelText ? (
                <>
                  {tooltipLabelText}:{" "}
                  <span style={{ fontWeight: 500 }}>{String(title)}</span>
                </>
              ) : (
                <span style={{ fontWeight: 500 }}>{String(title)}</span>
              )}
            </div>

            {rows.map((r) => (
              <div
                key={r.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      backgroundColor: r.color,
                      flex: "0 0 auto",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#111827",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={tooltipValueNameText}
                  >
                    {tooltipValueNameText}
                  </span>
                </div>
                
                {/* Custom value label name */}
                <span style={{ fontWeight: 800 }}>
                  {tooltipValueLabelText
                    ? `${r.value} ${tooltipValueLabelText}`
                    : r.value}
                </span>
              </div>
            ))}
          </div>
        );
      }}
      
      // Legend aligned to line
      legends={
        showLegend
          ? [
              {
                dataFrom: "keys",
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 80,
                itemsSpacing: 16,
                itemWidth: 120,
                itemHeight: 20,
                symbolSize: 10,
                symbolShape: "circle",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                effects: [
                  {
                    on: "hover",
                    style: { itemOpacity: 1 },
                  },
                ],
              },
            ]
          : []
      }
      motionConfig="slow"
    />
  );
}