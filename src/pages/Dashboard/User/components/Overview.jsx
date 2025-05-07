"use client"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "./ui/index"

export function Overview({ data, isRsvpTrend = false }) {
  console.log("Data passed to Overview:", data) // Kiểm tra dữ liệu truyền vào component

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
