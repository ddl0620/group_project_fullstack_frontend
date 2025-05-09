"use client"

import { useEffect, useState, useRef } from "react"
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

export function LineChart({
                            data,
                            height = 350,
                            series = [
                              { dataKey: "accepted", color: "#4ade80" },
                              { dataKey: "denied", color: "#f87171" },
                              { dataKey: "pending", color: "#facc15" },
                            ],
                            valueFormatter = (value) => `${value}`,
                          }) {
  const chartRef = useRef(null)
  const [chartConfig, setChartConfig] = useState({
    height,
    showGrid: true,
    legendPosition: "bottom",
    strokeWidth: 2,
    yAxisWidth: 40,
    tickSize: 12,
    margin: { top: 10, right: 10, bottom: 30, left: 0 },
    hideXAxis: false,
    hideYAxis: false,
    minValue: "auto",
    maxValue: "auto",
  })

  // Adjust chart based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 360) {
        // Extra small screens (iPhone SE/5/etc)
        setChartConfig({
          height: 180,
          showGrid: false,
          legendPosition: "bottom",
          strokeWidth: 1.5,
          yAxisWidth: 25,
          tickSize: 8,
          margin: { top: 5, right: 5, bottom: 30, left: 0 },
          hideXAxis: false,
          hideYAxis: false,
          minValue: 0,
          maxValue: calculateMaxValue(),
        })
      } else if (width < 375) {
        // iPhone 8 size
        setChartConfig({
          height: 200,
          showGrid: false,
          legendPosition: "bottom",
          strokeWidth: 1.5,
          yAxisWidth: 30,
          tickSize: 9,
          margin: { top: 5, right: 5, bottom: 30, left: 0 },
          hideXAxis: false,
          hideYAxis: false,
          minValue: 0,
          maxValue: calculateMaxValue(),
        })
      } else if (width < 640) {
        // sm breakpoint
        setChartConfig({
          height: 250,
          showGrid: false,
          legendPosition: "bottom",
          strokeWidth: 1.5,
          yAxisWidth: 35,
          tickSize: 10,
          margin: { top: 10, right: 10, bottom: 30, left: 0 },
          hideXAxis: false,
          hideYAxis: false,
          minValue: 0,
          maxValue: "auto",
        })
      } else {
        setChartConfig({
          height,
          showGrid: true,
          legendPosition: "bottom",
          strokeWidth: 2,
          yAxisWidth: 40,
          tickSize: 12,
          margin: { top: 10, right: 10, bottom: 30, left: 0 },
          hideXAxis: false,
          hideYAxis: false,
          minValue: "auto",
          maxValue: "auto",
        })
      }
    }

    // Calculate the maximum value across all series
    const calculateMaxValue = () => {
      let max = 0
      data.forEach((item) => {
        series.forEach((s) => {
          if (item[s.dataKey] > max) {
            max = item[s.dataKey]
          }
        })
      })
      return max * 1.2 || 10 // Add 20% padding
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [height, data, series])

  // Calculate domain for Y axis to ensure proper scaling
  const yAxisDomain = [
    chartConfig.minValue === "auto" ? 0 : chartConfig.minValue,
    chartConfig.maxValue === "auto" ? "auto" : chartConfig.maxValue,
  ]

  return (
    <div ref={chartRef} className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <RechartsLineChart data={data} margin={chartConfig.margin}>
          {!chartConfig.hideXAxis && (
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={chartConfig.tickSize}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#888888", fontSize: chartConfig.tickSize }}
              tickMargin={8}
              minTickGap={5}
              interval="preserveStartEnd"
            />
          )}
          {!chartConfig.hideYAxis && (
            <YAxis
              stroke="#888888"
              fontSize={chartConfig.tickSize}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={chartConfig.yAxisWidth}
              domain={yAxisDomain}
              allowDecimals={false}
            />
          )}
          {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />}
          <Tooltip
            contentStyle={{
              fontSize: "12px",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
            }}
            formatter={(value, name) => [valueFormatter(value), name]}
          />
          <Legend
            verticalAlign={chartConfig.legendPosition}
            height={36}
            iconSize={10}
            wrapperStyle={{ fontSize: "12px" }}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          />
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              stroke={s.color}
              strokeWidth={chartConfig.strokeWidth}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
              name={s.dataKey.charAt(0).toUpperCase() + s.dataKey.slice(1)}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
