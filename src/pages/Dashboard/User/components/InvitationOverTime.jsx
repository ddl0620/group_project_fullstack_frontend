"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "./ui/index"

export function InvitationOvertime({ data }) {
    return (
        <ChartContainer
        config={{
            value: {
            label: "Invitations",
            color: "hsl(var(--chart-1))",
            },
        }}
        className="h-[300px]"
        >
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
                type="monotone" // Đảm bảo thuộc tính này được đặt
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