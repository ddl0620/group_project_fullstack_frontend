"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "./ui/index"

export function InvitationOvertime({ data }) {
    // Log raw data for debugging
    console.log("Raw Invitations Over Time Data:", data)

    // Validate and preprocess data
    const preprocessData = (rawData) => {
        if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return []
        }

        // Filter valid entries and sort by date
        let filteredData = rawData
        .filter(item => {
            const isValid = item && item.date && typeof item.invitations === 'number'
            if (!isValid) {
            console.warn("Invalid data entry:", item)
            }
            return isValid
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

        if (filteredData.length === 0) {
        return []
        }

        // Fill in missing dates with invitations: 0
        const result = []
        const startDate = new Date(filteredData[0].date)
        const endDate = new Date(filteredData[filteredData.length - 1].date)
        let currentDate = new Date(startDate)

        while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]
        const existingEntry = filteredData.find(item => item.date === dateStr)
        result.push({
            date: dateStr,
            invitations: existingEntry ? existingEntry.invitations : 0,
        })
        currentDate.setDate(currentDate.getDate() + 1)
        }

        return result
    }

    const formattedData = preprocessData(data)
    console.log("Formatted Data for Recharts:", formattedData)

    // Fallback for empty data
    if (!formattedData.length) {
        return (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for the chart
        </div>
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
        className="h-[250px] sm:h-[300px]"
        >
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={formattedData}
            margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip
                formatter={(value) => [value, "Invitations"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Line
                type="monotone"
                dataKey="invitations"
                stroke="black" // Hardcode color to rule out CSS variable issues
                strokeWidth={1.5}
                activeDot={{ r: 6 }}
                dot={{ r: 1.5 }} // Ensure dots are always visible
                connectNulls={true}
            />
            </LineChart>
        </ResponsiveContainer>
        </ChartContainer>
    )
}