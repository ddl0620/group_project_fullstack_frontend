"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer } from '@/pages/Dashboard/Admin/components/dashboard/tables/ResponsiveContainer.jsx';

export function ResponsiveTable({ data, columns, minWidth = 650, renderRow, emptyMessage = "No data available" }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <ResponsiveContainer>
      <div style={{ minWidth: isSmallScreen ? "100%" : minWidth }}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{data.map((item, index) => renderRow(item, index))}</TableBody>
        </Table>
      </div>
    </ResponsiveContainer>
  )
}
