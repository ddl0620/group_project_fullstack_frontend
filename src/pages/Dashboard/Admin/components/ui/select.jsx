"use client"

import React, { useState, forwardRef } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "./index"

export const Select = ({ children, value, onValueChange, ...props }) => {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectTrigger") {
          return React.cloneElement(child, {
            onClick: () => setOpen(!open),
            value: selectedValue,
          })
        }
        if (child.type.displayName === "SelectContent") {
          return open
            ? React.cloneElement(child, {
                onValueChange: (value) => {
                  setSelectedValue(value)
                  onValueChange(value)
                  setOpen(false)
                },
              })
            : null
        }
        return child
      })}
    </div>
  )
}

export const SelectTrigger = forwardRef(({ className, children, value, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => (
  <span className={cn("", className)} {...props} ref={ref}>
    {props.children || placeholder}
  </span>
))
SelectValue.displayName = "SelectValue"

export const SelectContent = forwardRef(({ className, children, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      className,
    )}
    {...props}
  >
    <div className="p-1">
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectItem") {
          return React.cloneElement(child, { onValueChange })
        }
        return child
      })}
    </div>
  </div>
))
SelectContent.displayName = "SelectContent"

export const SelectItem = forwardRef(({ className, children, value, onValueChange, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    onClick={() => onValueChange(value)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {/* Can add a check icon here for selected item */}
    </span>
    {children}
  </button>
))
SelectItem.displayName = "SelectItem"
