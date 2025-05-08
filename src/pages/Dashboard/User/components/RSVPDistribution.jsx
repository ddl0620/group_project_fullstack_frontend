"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts"
import { ChartContainer } from "./ui/index"

export function RsvpDistribution({ data }) {
  console.log("RSVP Distribution Data in Component:", data) // Kiểm tra dữ liệu được truyền vào component
  return (
    <ChartContainer
      config={{
        value: {
          label: "Count",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="var(--color-value)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
