"use client"

export function ResponsiveContainer({ children, className = "", minHeight = 250 }) {
  return (
    <div
      className={`w-full overflow-auto scrollbar-thin ${className}`}
      style={{
        minHeight: `${minHeight}px`,
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  )
}
