"use client"

import React, { useState, forwardRef } from "react"
import { cn } from "./index"

export const Popover = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block text-left" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "PopoverTrigger") {
          return React.cloneElement(child, { onClick: () => setOpen(!open) })
        }
        if (child.type.displayName === "PopoverContent") {
          return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null
        }
        return child
      })}
    </div>
  )
}

export const PopoverTrigger = forwardRef(({ className, children, asChild, ...props }, ref) => (
  <button ref={ref} className={cn("", className)} {...props}>
    {children}
  </button>
))
PopoverTrigger.displayName = "PopoverTrigger"

export const PopoverContent = forwardRef(({ className, children, align = "center", onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      className,
    )}
    {...props}
  >
    {children}
  </div>
))
PopoverContent.displayName = "PopoverContent"
