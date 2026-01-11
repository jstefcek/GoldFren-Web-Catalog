import { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTranslation } from "react-i18next";

// Custom Responsive Line component
export function Custom_ResponsiveLine({ 
    Data = [], 
    axisBottomText = "", 
    axisLeftText = "", 
    tooltipLabel = "",
    tickValue = 10,
}) {
  // Init translation hook
  const { t } = useTranslation();

  // Translate axis texts
  const axisBottomLabel = axisBottomText ? t(axisBottomText) : "";
  const axisLeftLabel = axisLeftText ? t(axisLeftText) : "";
  const tooltipLabelText = tooltipLabel ? t(tooltipLabel) : "";

  // Color palette for lines
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

  // Map series keys to colors
  const seriesColorMap = useMemo(() => {
    const map = {};
    (Data || []).forEach((s, idx) => {
      const raw = s.id ?? s.label ?? `series_${idx + 1}`;
      const key = cleanKey(raw);
      map[key] = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    });
    return map;
  }, [Data]);

  return (
      <ResponsiveLine
        data={Data}
        margin={{ top: 10, right: 30, bottom: 80, left: 60 }}
        xScale={{ type: "time", precision: "day" }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisBottom={{
          format: "%d.%m",
          tickValues: tickValue,
          tickRotation: -25,
          tickPadding: 10,
          legend: axisBottomLabel,
          legendOffset: 45,
        }}
        axisLeft={{
          legend: axisLeftLabel,
          legendOffset: -45,
        }}
        enableSlices="x"
        useMesh={false}
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
        sliceTooltip={({ slice }) => (
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
            {/* Tooltip content */}
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
              {tooltipLabelText}:{" "}
              <span style={{ fontWeight: 500 }}>
                {slice.points?.[0]?.data?.xFormatted ?? slice.points?.[0]?.data?.x}
              </span>
            </div>

            {/* Tooltip content */}
            {slice.points
              .slice()
              .sort((a, b) => (b.data.y ?? 0) - (a.data.y ?? 0))
              .map((p) => {
                const rawLabel =
                  p.serieId ?? p.serie?.id ?? p.serie?.label ?? p.id ?? "Series";
                const cleanLabel = cleanKey(rawLabel);
                const color = seriesColorMap[cleanLabel] ?? "#9CA3AF";

                return (
                  <div
                    key={p.id}
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
                          backgroundColor: color,
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
                        title={cleanLabel}
                      >
                        {cleanLabel}
                      </span>
                    </div>

                    {/* Tooltip content */}
                    <span style={{ fontWeight: 800, color: "#111827" }}>
                      {p.data.yFormatted ?? p.data.y}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
        colors={(serie) => {
          const id = serie?.id ?? serie?.label ?? serie;
          return seriesColorMap[cleanKey(id)] ?? COLOR_PALETTE[0];
        }}
        lineWidth={2}
        pointSize={4}
        pointColor={{ theme: "background" }}
        pointBorderWidth={6}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        legends={[
          {
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
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        motionConfig="slow"
      />
  );
}
