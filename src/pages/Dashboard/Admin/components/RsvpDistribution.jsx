import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

// Sample data for RSVP distribution
const data = [
    { name: "Accepted", value: 842 },
    { name: "Denied", value: 77 },
    { name: "Pending", value: 329 },
]

export function RsvpDistribution() {
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
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
        </ResponsiveContainer>
        </ChartContainer>
    )
}
