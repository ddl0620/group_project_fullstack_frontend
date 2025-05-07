"use client"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "./ui/index"

export function Overview({ interval, isRsvpTrend = false }) {
  // Sample data for invitations over time
  const dailyData = [
    { date: "2023-05-01", invitations: 12, accepted: 8, denied: 2, pending: 2 },
    { date: "2023-05-02", invitations: 18, accepted: 10, denied: 3, pending: 5 },
    { date: "2023-05-03", invitations: 15, accepted: 9, denied: 2, pending: 4 },
    { date: "2023-05-04", invitations: 25, accepted: 15, denied: 5, pending: 5 },
    { date: "2023-05-05", invitations: 30, accepted: 20, denied: 4, pending: 6 },
    { date: "2023-05-06", invitations: 22, accepted: 14, denied: 3, pending: 5 },
    { date: "2023-05-07", invitations: 18, accepted: 12, denied: 2, pending: 4 },
    { date: "2023-05-08", invitations: 24, accepted: 16, denied: 3, pending: 5 },
    { date: "2023-05-09", invitations: 28, accepted: 18, denied: 4, pending: 6 },
    { date: "2023-05-10", invitations: 32, accepted: 22, denied: 5, pending: 5 },
    { date: "2023-05-11", invitations: 35, accepted: 25, denied: 4, pending: 6 },
    { date: "2023-05-12", invitations: 30, accepted: 20, denied: 5, pending: 5 },
    { date: "2023-05-13", invitations: 28, accepted: 18, denied: 4, pending: 6 },
    { date: "2023-05-14", invitations: 24, accepted: 16, denied: 3, pending: 5 },
  ]

  const weeklyData = [
    { date: "Week 1", invitations: 120, accepted: 80, denied: 20, pending: 20 },
    { date: "Week 2", invitations: 150, accepted: 100, denied: 25, pending: 25 },
    { date: "Week 3", invitations: 180, accepted: 120, denied: 30, pending: 30 },
    { date: "Week 4", invitations: 210, accepted: 140, denied: 35, pending: 35 },
    { date: "Week 5", invitations: 240, accepted: 160, denied: 40, pending: 40 },
    { date: "Week 6", invitations: 270, accepted: 180, denied: 45, pending: 45 },
  ]

  const data = interval === "daily" ? dailyData : weeklyData

  if (isRsvpTrend) {
    return (
      <ChartContainer
        config={{
          accepted: {
            label: "Accepted",
            color: "hsl(var(--chart-1))",
          },
          denied: {
            label: "Denied",
            color: "hsl(var(--chart-2))",
          },
          pending: {
            label: "Pending",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}`} />
            <ChartTooltipContent />
            <Legend />
            <Line
              type="monotone"
              dataKey="accepted"
              stroke="var(--color-accepted)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line type="monotone" dataKey="denied" stroke="var(--color-denied)" strokeWidth={2} />
            <Line type="monotone" dataKey="pending" stroke="var(--color-pending)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      config={{
        invitations: {
          label: "Invitations",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}`} />
          <ChartTooltipContent />
          <Line
            type="monotone"
            dataKey="invitations"
            stroke="var(--color-invitations)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
