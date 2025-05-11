"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts"
import { ChartContainer } from "./ui/index"

export function RsvpDistribution({ data }) {
  console.log("RSVP Distribution Data in Component:", data)
  return (
    <ChartContainer
      config={{
        value: {
          label: "Count",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[250px] sm:h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="var(--color-value)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}