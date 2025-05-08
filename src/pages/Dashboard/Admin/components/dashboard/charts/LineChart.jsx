"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function LineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="accepted" stroke="#4ade80" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="denied" stroke="#f87171" strokeWidth={2} />
        <Line type="monotone" dataKey="pending" stroke="#facc15" strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
