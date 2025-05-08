"use client"

import React, { useState, forwardRef } from "react"
import { Check } from "lucide-react"
import { cn } from "./index"

export const DropdownMenu = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block text-left" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "DropdownMenuTrigger") {
          return React.cloneElement(child, { onClick: () => setOpen(!open) })
        }
        if (child.type.displayName === "DropdownMenuContent") {
          return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null
        }
        return child
      })}
    </div>
  )
}

export const DropdownMenuTrigger = forwardRef(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn("", className)} {...props}>
    {children}
  </button>
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent = forwardRef(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
      className,
    )}
    {...props}
  >
    <div className="py-1" onClick={onClose}>
      {children}
    </div>
  </div>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-gray-900",
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export const DropdownMenuLabel = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-3 py-2 text-sm font-medium", className)} {...props} />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("my-1 h-px bg-gray-200", className)} {...props} />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export const DropdownMenuGroup = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
DropdownMenuGroup.displayName = "DropdownMenuGroup"

export const DropdownMenuShortcut = ({ className, ...props }) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export const DropdownMenuCheckboxItem = forwardRef(({ className, children, checked, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </button>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"
