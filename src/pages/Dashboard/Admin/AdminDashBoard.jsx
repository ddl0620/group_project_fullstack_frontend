// "use client"

// import React, { useState, forwardRef } from "react"
// import { subDays, format } from "date-fns"
// import {
//     Mail,
//     MessageSquare,
//     Search,
//     User,
//     Users,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     MoreHorizontal,
//     Check,
//     CalendarIcon,
//     ArrowUpDown,
// } from "lucide-react"
// import { DayPicker } from "react-day-picker"
// import { cva } from "class-variance-authority"
// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table"
// import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

// // Utility function for class names
// const cn = (...inputs) => {
//     return inputs.filter(Boolean).join(" ")
// }

// // Button Component
// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// )

// const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
//   return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
// })
// Button.displayName = "Button"

// // Input Component
// const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
//   return (
//     <input
//       type={type}
//       className={cn(
//         "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         className,
//       )}
//       ref={ref}
//       {...props}
//     />
//   )
// })
// Input.displayName = "Input"

// // Card Components
// const Card = forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
// ))
// Card.displayName = "Card"

// const CardHeader = forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
// ))
// CardHeader.displayName = "CardHeader"

// const CardTitle = forwardRef(({ className, ...props }, ref) => (
//   <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
// ))
// CardTitle.displayName = "CardTitle"

// const CardDescription = forwardRef(({ className, ...props }, ref) => (
//   <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
// ))
// CardDescription.displayName = "CardDescription"

// const CardContent = forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
// ))
// CardContent.displayName = "CardContent"

// // Badge Component
// const badgeVariants = cva(
//   "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
//   {
//     variants: {
//       variant: {
//         default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
//         secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
//         outline: "text-foreground",
//         success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   },
// )

// function Badge({ className, variant, ...props }) {
//     return <div className={cn(badgeVariants({ variant }), className)} {...props} />
// }

// // Tabs Components
// const Tabs = ({ defaultValue, children, className, ...props }) => {
//     const [activeTab, setActiveTab] = useState(defaultValue)

//     return (
//         <div className={cn("space-y-4", className)} {...props}>
//         {React.Children.map(children, (child) => {
//             if (child.type.displayName === "TabsList") {
//             return React.cloneElement(child, { activeTab, setActiveTab })
//             }
//             if (child.type.displayName === "TabsContent") {
//             return React.cloneElement(child, { activeTab })
//             }
//             return child
//         })}
//         </div>
//     )
// }

// const TabsList = ({ children, className, activeTab, setActiveTab, ...props }) => {
//     return (
//         <div
//         className={cn(
//             "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
//             className,
//         )}
//         {...props}
//         >
//         {React.Children.map(children, (child) => {
//             if (child.type.displayName === "TabsTrigger") {
//             return React.cloneElement(child, { activeTab, setActiveTab })
//             }
//             return child
//         })}
//         </div>
//     )
// }
// TabsList.displayName = "TabsList"

// const TabsTrigger = ({ value, children, className, activeTab, setActiveTab, ...props }) => {
//   return (
//     <button
//       className={cn(
//         "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//         activeTab === value
//           ? "bg-background text-foreground shadow-sm"
//           : "hover:bg-background/50 hover:text-foreground",
//         className,
//       )}
//       onClick={() => setActiveTab(value)}
//       {...props}
//     >
//       {children}
//     </button>
//   )
// }
// TabsTrigger.displayName = "TabsTrigger"

// const TabsContent = ({ value, children, className, activeTab, ...props }) => {
//   if (activeTab !== value) return null

//   return (
//     <div
//       className={cn(
//         "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
//         className,
//       )}
//       {...props}
//     >
//       {children}
//     </div>
//   )
// }
// TabsContent.displayName = "TabsContent"

// // Table Components
// const Table = forwardRef(({ className, ...props }, ref) => (
//   <div className="relative w-full overflow-auto">
//     <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
//   </div>
// ))
// Table.displayName = "Table"

// const TableHeader = forwardRef(({ className, ...props }, ref) => (
//   <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
// ))
// TableHeader.displayName = "TableHeader"

// const TableBody = forwardRef(({ className, ...props }, ref) => (
//   <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
// ))
// TableBody.displayName = "TableBody"

// const TableRow = forwardRef(({ className, ...props }, ref) => (
//   <tr
//     ref={ref}
//     className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
//     {...props}
//   />
// ))
// TableRow.displayName = "TableRow"

// const TableHead = forwardRef(({ className, ...props }, ref) => (
//   <th
//     ref={ref}
//     className={cn(
//       "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
//       className,
//     )}
//     {...props}
//   />
// ))
// TableHead.displayName = "TableHead"

// const TableCell = forwardRef(({ className, ...props }, ref) => (
//   <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
// ))
// TableCell.displayName = "TableCell"

// // Dropdown Menu Components
// const DropdownMenu = ({ children, ...props }) => {
//   const [open, setOpen] = useState(false)

//   return (
//     <div className="relative inline-block text-left" {...props}>
//       {React.Children.map(children, (child) => {
//         if (child.type.displayName === "DropdownMenuTrigger") {
//           return React.cloneElement(child, { onClick: () => setOpen(!open) })
//         }
//         if (child.type.displayName === "DropdownMenuContent") {
//           return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null
//         }
//         return child
//       })}
//     </div>
//   )
// }

// const DropdownMenuTrigger = forwardRef(({ className, children, ...props }, ref) => (
//   <button ref={ref} className={cn("", className)} {...props}>
//     {children}
//   </button>
// ))
// DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

// const DropdownMenuContent = forwardRef(({ className, children, onClose, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
//       className,
//     )}
//     {...props}
//   >
//     <div className="py-1" onClick={onClose}>
//       {children}
//     </div>
//   </div>
// ))
// DropdownMenuContent.displayName = "DropdownMenuContent"

// const DropdownMenuItem = forwardRef(({ className, ...props }, ref) => (
//   <button
//     ref={ref}
//     className={cn(
//       "text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-gray-900",
//       className,
//     )}
//     {...props}
//   />
// ))
// DropdownMenuItem.displayName = "DropdownMenuItem"

// const DropdownMenuLabel = forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("px-3 py-2 text-sm font-medium", className)} {...props} />
// ))
// DropdownMenuLabel.displayName = "DropdownMenuLabel"

// const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("my-1 h-px bg-gray-200", className)} {...props} />
// ))
// DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

// const DropdownMenuGroup = forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("", className)} {...props} />
// ))
// DropdownMenuGroup.displayName = "DropdownMenuGroup"

// const DropdownMenuShortcut = ({ className, ...props }) => {
//   return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
// }
// DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// const DropdownMenuCheckboxItem = forwardRef(({ className, children, checked, ...props }, ref) => (
//   <button
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className,
//     )}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       {checked && <Check className="h-4 w-4" />}
//     </span>
//     {children}
//   </button>
// ))
// DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

// // Select Components
// const Select = ({ children, value, onValueChange, ...props }) => {
//   const [open, setOpen] = useState(false)
//   const [selectedValue, setSelectedValue] = useState(value)

//   return (
//     <div className="relative" {...props}>
//       {React.Children.map(children, (child) => {
//         if (child.type.displayName === "SelectTrigger") {
//           return React.cloneElement(child, {
//             onClick: () => setOpen(!open),
//             value: selectedValue,
//           })
//         }
//         if (child.type.displayName === "SelectContent") {
//           return open
//             ? React.cloneElement(child, {
//                 onValueChange: (value) => {
//                   setSelectedValue(value)
//                   onValueChange(value)
//                   setOpen(false)
//                 },
//               })
//             : null
//         }
//         return child
//       })}
//     </div>
//   )
// }

// const SelectTrigger = forwardRef(({ className, children, value, ...props }, ref) => (
//   <button
//     ref={ref}
//     className={cn(
//       "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//       className,
//     )}
//     {...props}
//   >
//     {children}
//     <ChevronDown className="h-4 w-4 opacity-50" />
//   </button>
// ))
// SelectTrigger.displayName = "SelectTrigger"

// const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => (
//   <span className={cn("", className)} {...props} ref={ref}>
//     {props.children || placeholder}
//   </span>
// ))
// SelectValue.displayName = "SelectValue"

// const SelectContent = forwardRef(({ className, children, onValueChange, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
//       className,
//     )}
//     {...props}
//   >
//     <div className="p-1">
//       {React.Children.map(children, (child) => {
//         if (child.type.displayName === "SelectItem") {
//           return React.cloneElement(child, { onValueChange })
//         }
//         return child
//       })}
//     </div>
//   </div>
// ))
// SelectContent.displayName = "SelectContent"

// const SelectItem = forwardRef(({ className, children, value, onValueChange, ...props }, ref) => (
//   <button
//     ref={ref}
//     className={cn(
//       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className,
//     )}
//     onClick={() => onValueChange(value)}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       {/* Can add a check icon here for selected item */}
//     </span>
//     {children}
//   </button>
// ))
// SelectItem.displayName = "SelectItem"

// // Avatar Components
// const Avatar = forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
//     {...props}
//   />
// ))
// Avatar.displayName = "Avatar"

// const AvatarImage = forwardRef(({ className, ...props }, ref) => (
//   <img ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
// ))
// AvatarImage.displayName = "AvatarImage"

// const AvatarFallback = forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
//     {...props}
//   />
// ))
// AvatarFallback.displayName = "AvatarFallback"

// // Calendar Component
// function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//         month: "space-y-4",
//         caption: "flex justify-center pt-1 relative items-center",
//         caption_label: "text-sm font-medium",
//         nav: "space-x-1 flex items-center",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-y-1",
//         head_row: "flex",
//         head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
//         row: "flex w-full mt-2",
//         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//         day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
//         day_range_end: "day-range-end",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside:
//           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
//         day_disabled: "text-muted-foreground opacity-50",
//         day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: () => <ChevronLeft className="h-4 w-4" />,
//         IconRight: () => <ChevronRight className="h-4 w-4" />,
//       }}
//       {...props}
//     />
//   )
// }

// // Popover Components
// const Popover = ({ children, ...props }) => {
//   const [open, setOpen] = useState(false)

//   return (
//     <div className="relative inline-block text-left" {...props}>
//       {React.Children.map(children, (child) => {
//         if (child.type.displayName === "PopoverTrigger") {
//           return React.cloneElement(child, { onClick: () => setOpen(!open) })
//         }
//         if (child.type.displayName === "PopoverContent") {
//           return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null
//         }
//         return child
//       })}
//     </div>
//   )
// }

// const PopoverTrigger = forwardRef(({ className, children, asChild, ...props }, ref) => (
//   <button ref={ref} className={cn("", className)} {...props}>
//     {children}
//   </button>
// ))
// PopoverTrigger.displayName = "PopoverTrigger"

// const PopoverContent = forwardRef(({ className, children, align = "center", onClose, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
//       className,
//     )}
//     {...props}
//   >
//     {children}
//   </div>
// ))
// PopoverContent.displayName = "PopoverContent"

// // Chart Components
// const ChartContainer = ({ children, config, className, ...props }) => {
//   // Create CSS variables for each color in the config
//   const style = {}
//   if (config) {
//     Object.entries(config).forEach(([key, value]) => {
//       style[`--color-${key}`] = value.color
//     })
//   }

//   return (
//     <div className={cn("chart-container", className)} style={style} {...props}>
//       {children}
//     </div>
//   )
// }

// const ChartTooltip = ({ content, ...props }) => {
//   return content
// }

// const ChartTooltipContent = ({ active, payload, label }) => {
//   if (!active || !payload || !payload.length) {
//     return null
//   }

//   return (
//     <div className="rounded-lg border bg-background p-2 shadow-sm">
//       <div className="grid grid-cols-2 gap-2">
//         <div className="font-medium">{label}</div>
//         <div className="font-medium text-right"></div>
//         {payload.map((item, index) => (
//           <React.Fragment key={index}>
//             <div className="flex items-center gap-1">
//               <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.stroke }}></div>
//               <div>{item.name}</div>
//             </div>
//             <div className="text-right font-medium">{item.value}</div>
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   )
// }

// // Date Range Picker Component
// function DatePickerWithRange({ className, date, setDate }) {
//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant="outline"
//             className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
//                 </>
//               ) : (
//                 format(date.from, "LLL dd, y")
//               )
//             ) : (
//               <span>Pick a date range</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={setDate}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }

// // User Nav Component
// function UserNav() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/placeholder-user.jpg" alt="@user" />
//             <AvatarFallback>JD</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end">
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">John Doe</p>
//             <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             Profile
//             <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             Billing
//             <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             Settings
//             <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           Log out
//           <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// // Overview Component
// function Overview({ interval, isRsvpTrend = false }) {
//   // Sample data for invitations over time
//   const dailyData = [
//     { date: "2023-05-01", invitations: 12, accepted: 8, denied: 2, pending: 2 },
//     { date: "2023-05-02", invitations: 18, accepted: 10, denied: 3, pending: 5 },
//     { date: "2023-05-03", invitations: 15, accepted: 9, denied: 2, pending: 4 },
//     { date: "2023-05-04", invitations: 25, accepted: 15, denied: 5, pending: 5 },
//     { date: "2023-05-05", invitations: 30, accepted: 20, denied: 4, pending: 6 },
//     { date: "2023-05-06", invitations: 22, accepted: 14, denied: 3, pending: 5 },
//     { date: "2023-05-07", invitations: 18, accepted: 12, denied: 2, pending: 4 },
//     { date: "2023-05-08", invitations: 24, accepted: 16, denied: 3, pending: 5 },
//     { date: "2023-05-09", invitations: 28, accepted: 18, denied: 4, pending: 6 },
//     { date: "2023-05-10", invitations: 32, accepted: 22, denied: 5, pending: 5 },
//     { date: "2023-05-11", invitations: 35, accepted: 25, denied: 4, pending: 6 },
//     { date: "2023-05-12", invitations: 30, accepted: 20, denied: 5, pending: 5 },
//     { date: "2023-05-13", invitations: 28, accepted: 18, denied: 4, pending: 6 },
//     { date: "2023-05-14", invitations: 24, accepted: 16, denied: 3, pending: 5 },
//   ]

//   const weeklyData = [
//     { date: "Week 1", invitations: 120, accepted: 80, denied: 20, pending: 20 },
//     { date: "Week 2", invitations: 150, accepted: 100, denied: 25, pending: 25 },
//     { date: "Week 3", invitations: 180, accepted: 120, denied: 30, pending: 30 },
//     { date: "Week 4", invitations: 210, accepted: 140, denied: 35, pending: 35 },
//     { date: "Week 5", invitations: 240, accepted: 160, denied: 40, pending: 40 },
//     { date: "Week 6", invitations: 270, accepted: 180, denied: 45, pending: 45 },
//   ]

//   const data = interval === "daily" ? dailyData : weeklyData

//   if (isRsvpTrend) {
//     return (
//       <ChartContainer
//         config={{
//           accepted: {
//             label: "Accepted",
//             color: "hsl(var(--chart-1))",
//           },
//           denied: {
//             label: "Denied",
//             color: "hsl(var(--chart-2))",
//           },
//           pending: {
//             label: "Pending",
//             color: "hsl(var(--chart-3))",
//           },
//         }}
//         className="h-[400px]"
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={data}
//             margin={{
//               top: 5,
//               right: 10,
//               left: 10,
//               bottom: 0,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} fontSize={12} />
//             <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}`} />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="accepted"
//               stroke="var(--color-accepted)"
//               strokeWidth={2}
//               activeDot={{ r: 6 }}
//             />
//             <Line type="monotone" dataKey="denied" stroke="var(--color-denied)" strokeWidth={2} />
//             <Line type="monotone" dataKey="pending" stroke="var(--color-pending)" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>
//     )
//   }

//   return (
//     <ChartContainer
//       config={{
//         invitations: {
//           label: "Invitations",
//           color: "hsl(var(--chart-1))",
//         },
//       }}
//       className="h-[400px]"
//     >
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{
//             top: 5,
//             right: 10,
//             left: 10,
//             bottom: 0,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} fontSize={12} />
//           <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}`} />
//           <ChartTooltip content={<ChartTooltipContent />} />
//           <Line
//             type="monotone"
//             dataKey="invitations"
//             stroke="var(--color-invitations)"
//             strokeWidth={2}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   )
// }

// // RSVP Distribution Component
// function RsvpDistribution() {
//   // Sample data for RSVP distribution
//   const data = [
//     { name: "Accepted", value: 842 },
//     { name: "Denied", value: 77 },
//     { name: "Pending", value: 329 },
//   ]

//   return (
//     <ChartContainer
//       config={{
//         value: {
//           label: "Count",
//           color: "hsl(var(--chart-1))",
//         },
//       }}
//       className="h-[300px]"
//     >
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <ChartTooltip content={<ChartTooltipContent />} />
//           <Legend />
//           <Bar dataKey="value" fill="var(--color-value)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   )
// }

// // Recent Recipients Component
// function RecentRecipients({ fullTable = false }) {
//     const [sorting, setSorting] = useState([])
//     const [columnFilters, setColumnFilters] = useState([])
//     const [columnVisibility, setColumnVisibility] = useState({})
//     const [rowSelection, setRowSelection] = useState({})

//   // Sample data for recipients
//     const data = [
//         {
//         id: "1",
//         name: "John Doe",
//         email: "john.doe@example.com",
//         phone: "+1 (555) 123-4567",
//         rsvpStatus: "ACCEPTED",
//         invitedAt: "2023-05-10T14:30:00Z",
//         respondedAt: "2023-05-11T09:15:00Z",
//         },
//         {
//         id: "2",
//         name: "Jane Smith",
//         email: "jane.smith@example.com",
//         phone: "+1 (555) 987-6543",
//         rsvpStatus: "PENDING",
//         invitedAt: "2023-05-10T14:35:00Z",
//         respondedAt: null,
//         },
//         {
//         id: "3",
//         name: "Robert Johnson",
//         email: "robert.johnson@example.com",
//         phone: "+1 (555) 456-7890",
//         rsvpStatus: "DENIED",
//         invitedAt: "2023-05-10T14:40:00Z",
//         respondedAt: "2023-05-12T16:20:00Z",
//         },
//         {
//         id: "4",
//         name: "Emily Davis",
//         email: "emily.davis@example.com",
//         phone: "+1 (555) 234-5678",
//         rsvpStatus: "ACCEPTED",
//         invitedAt: "2023-05-11T09:30:00Z",
//         respondedAt: "2023-05-11T14:45:00Z",
//         },
//         {
//         id: "5",
//         name: "Michael Wilson",
//         email: "michael.wilson@example.com",
//         phone: "+1 (555) 876-5432",
//         rsvpStatus: "PENDING",
//         invitedAt: "2023-05-11T09:35:00Z",
//         respondedAt: null,
//         },
//         {
//         id: "6",
//         name: "Sarah Brown",
//         email: "sarah.brown@example.com",
//         phone: "+1 (555) 345-6789",
//         rsvpStatus: "ACCEPTED",
//         invitedAt: "2023-05-11T09:40:00Z",
//         respondedAt: "2023-05-12T11:10:00Z",
//         },
//         {
//         id: "7",
//         name: "David Miller",
//         email: "david.miller@example.com",
//         phone: "+1 (555) 654-3210",
//         rsvpStatus: "DENIED",
//         invitedAt: "2023-05-12T10:30:00Z",
//         respondedAt: "2023-05-13T08:25:00Z",
//         },
//         {
//         id: "8",
//         name: "Jennifer Taylor",
//         email: "jennifer.taylor@example.com",
//         phone: "+1 (555) 789-0123",
//         rsvpStatus: "PENDING",
//         invitedAt: "2023-05-12T10:35:00Z",
//         respondedAt: null,
//         },
//         {
//         id: "9",
//         name: "Christopher Anderson",
//         email: "christopher.anderson@example.com",
//         phone: "+1 (555) 321-0987",
//         rsvpStatus: "ACCEPTED",
//         invitedAt: "2023-05-12T10:40:00Z",
//         respondedAt: "2023-05-12T15:30:00Z",
//         },
//         {
//         id: "10",
//         name: "Jessica Thomas",
//         email: "jessica.thomas@example.com",
//         phone: "+1 (555) 210-9876",
//         rsvpStatus: "PENDING",
//         invitedAt: "2023-05-13T11:30:00Z",
//         respondedAt: null,
//         },
//     ]

//     const columns = [
//         {
//         accessorKey: "name",
//         header: ({ column }) => {
//             return (
//             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//                 Name
//                 <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//             )
//         },
//         cell: ({ row }) => <div>{row.getValue("name")}</div>,
//         },
//         {
//         accessorKey: "email",
//         header: "Email",
//         cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//         },
//         {
//         accessorKey: "phone",
//         header: "Phone",
//         cell: ({ row }) => <div>{row.getValue("phone")}</div>,
//         },
//         {
//         accessorKey: "rsvpStatus",
//         header: "RSVP Status",
//         cell: ({ row }) => {
//             const status = row.getValue("rsvpStatus")
//             return (
//             <Badge variant={status === "ACCEPTED" ? "success" : status === "DENIED" ? "destructive" : "outline"}>
//                 {status.charAt(0) + status.slice(1).toLowerCase()}
//             </Badge>
//             )
//         },
//     },
//     {
//         accessorKey: "invitedAt",
//         header: "Invited At",
//         cell: ({ row }) => {
//             const date = new Date(row.getValue("invitedAt"))
//             return <div>{date.toLocaleDateString()}</div>
//         },
//     },
//     {
//     accessorKey: "respondedAt",
//         header: "Responded At",
//         cell: ({ row }) => {
//             const value = row.getValue("respondedAt")
//             if (!value) return <div>-</div>
//             const date = new Date(value)
//             return <div>{date.toLocaleDateString()}</div>
//         },
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const recipient = row.original

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem onClick={() => navigator.clipboard.writeText(recipient.email)}>
//                 Copy email
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>View details</DropdownMenuItem>
//               <DropdownMenuItem>Send reminder</DropdownMenuItem>
//               <DropdownMenuItem>Edit recipient</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]

//     const table = useReactTable({
//         data: fullTable ? data : data.slice(0, 5),
//         columns,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         onColumnVisibilityChange: setColumnVisibility,
//         onRowSelectionChange: setRowSelection,
//         state: {
//             sorting,
//             columnFilters,
//             columnVisibility,
//             rowSelection,
//         },
//     })

//     return (
//         <div className="w-full">
//         {fullTable && (
//             <div className="flex items-center py-4">
//             <Input
//                 placeholder="Filter by name..."
//                 value={table.getColumn("name")?.getFilterValue() ?? ""}
//                 onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
//                 className="max-w-sm"
//             />
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto">
//                     Columns <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                 {table
//                     .getAllColumns()
//                     .filter((column) => column.getCanHide())
//                     .map((column) => {
//                     return (
//                         <DropdownMenuCheckboxItem
//                         key={column.id}
//                         className="capitalize"
//                         checked={column.getIsVisible()}
//                         onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                         >
//                         {column.id}
//                         </DropdownMenuCheckboxItem>
//                     )
//                     })}
//                 </DropdownMenuContent>
//             </DropdownMenu>
//             </div>
//         )}
//         <div className="rounded-md border">
//             <Table>
//             <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => {
//                     return (
//                         <TableHead key={header.id}>
//                         {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                         </TableHead>
//                     )
//                     })}
//                 </TableRow>
//                 ))}
//             </TableHeader>
//             <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                     {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                     ))}
//                     </TableRow>
//                 ))
//                 ) : (
//                 <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                     No results.
//                     </TableCell>
//                 </TableRow>
//                 )}
//             </TableBody>
//             </Table>
//         </div>
//         {fullTable && (
//             <div className="flex items-center justify-end space-x-2 py-4">
//             <div className="flex-1 text-sm text-muted-foreground">
//                 {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
//                 selected.
//             </div>
//             <div className="space-x-2">
//                 <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//                 >
//                 Previous
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//                 Next
//                 </Button>
//             </div>
//             </div>
//         )}
//         </div>
//     )
// }

// // Main Dashboard Component
// export default function AdminDashboard() {
//     const [date, setDate] = useState({
//         from: subDays(new Date(), 30),
//         to: new Date(),
//     })

//     const [interval, setInterval] = useState("daily")

//     return (
//         <div className="flex min-h-screen flex-col">
//         <div className="border-b">
//             <div className="flex h-16 items-center px-4">
//             <div className="ml-auto flex items-center space-x-4">
//                 <div className="relative w-64">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="Search recipients..." className="pl-8" />
//                 </div>
//             </div>
//             </div>
//         </div>
//         <div className="flex-1 space-y-4 p-8 pt-6">
//             <div className="flex items-center justify-between space-y-2">
//             <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//             <div className="flex items-center space-x-2">
//                 <DatePickerWithRange date={date} setDate={setDate} />
//                 <Select value={interval} onValueChange={(value) => setInterval(value)}>
//                 <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select interval" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="daily">Daily</SelectItem>
//                     <SelectItem value="weekly">Weekly</SelectItem>
//                 </SelectContent>
//                 </Select>
//             </div>
//             </div>
//             <Tabs defaultValue="overview" className="space-y-4">
//             <TabsList>
//                 <TabsTrigger value="overview">Overview</TabsTrigger>
//                 <TabsTrigger value="recipients">Recipients</TabsTrigger>
//                 <TabsTrigger value="analytics">Analytics</TabsTrigger>
//             </TabsList>
//             <TabsContent value="overview" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
//                     <Mail className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                     <div className="text-2xl font-bold">1,248</div>
//                     <p className="text-xs text-muted-foreground">+20.1% from last month</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">RSVP Accepted</CardTitle>
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                     <div className="text-2xl font-bold">842</div>
//                     <p className="text-xs text-muted-foreground">+18.2% from last month</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">RSVP Pending</CardTitle>
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                     <div className="text-2xl font-bold">329</div>
//                     <p className="text-xs text-muted-foreground">-4.5% from last month</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
//                     <MessageSquare className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                     <div className="text-2xl font-bold">73.8%</div>
//                     <p className="text-xs text-muted-foreground">+5.2% from last month</p>
//                     </CardContent>
//                 </Card>
//                 </div>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//                 <Card className="col-span-4">
//                     <CardHeader>
//                     <CardTitle>Invitations Over Time</CardTitle>
//                     <CardDescription>
//                         Number of invitations sent {interval === "daily" ? "per day" : "per week"}
//                     </CardDescription>
//                     </CardHeader>
//                     <CardContent className="pl-2">
//                     <Overview interval={interval} />
//                     </CardContent>
//                 </Card>
//                 <Card className="col-span-3">
//                     <CardHeader>
//                     <CardTitle>RSVP Distribution</CardTitle>
//                     <CardDescription>Distribution of RSVP responses</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                     <RsvpDistribution />
//                     </CardContent>
//                 </Card>
//                 </div>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//                 <Card className="col-span-7">
//                     <CardHeader>
//                     <CardTitle>Recent Recipients</CardTitle>
//                     <CardDescription>Recently invited recipients and their RSVP status</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                     <RecentRecipients />
//                     </CardContent>
//                 </Card>
//                 </div>
//             </TabsContent>
//             <TabsContent value="recipients" className="space-y-4">
//                 <Card>
//                 <CardHeader>
//                     <CardTitle>All Recipients</CardTitle>
//                     <CardDescription>Manage all your event recipients</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <RecentRecipients fullTable={true} />
//                 </CardContent>
//                 </Card>
//             </TabsContent>
//             <TabsContent value="analytics" className="space-y-4">
//                 <Card>
//                 <CardHeader>
//                     <CardTitle>RSVP Trend</CardTitle>
//                     <CardDescription>RSVP responses over time</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <Overview interval={interval} isRsvpTrend={true} />
//                 </CardContent>
//                 </Card>
//             </TabsContent>
//             </Tabs>
//         </div>
//         </div>
//     )
// }

"use client"

import { useState } from "react"
import { subDays } from "date-fns"
import { Mail, MessageSquare, Search, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Input } from "./components/ui/index"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select"
import { DatePickerWithRange } from "./components/DatePickerWithRange"
import { Overview } from "./components/Overview"
import { RsvpDistribution } from "./components/RSVPDistribution"
import { RecentRecipients } from "./components/RecentRecipents"

export default function AdminDashboard() {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [interval, setInterval] = useState("daily")

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search recipients..." className="pl-8" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange date={date} setDate={setDate} />
            <Select value={interval} onValueChange={(value) => setInterval(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RSVP Accepted</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">842</div>
                  <p className="text-xs text-muted-foreground">+18.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RSVP Pending</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">329</div>
                  <p className="text-xs text-muted-foreground">-4.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">73.8%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Invitations Over Time</CardTitle>
                  <CardDescription>
                    Number of invitations sent {interval === "daily" ? "per day" : "per week"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview interval={interval} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>RSVP Distribution</CardTitle>
                  <CardDescription>Distribution of RSVP responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <RsvpDistribution />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Recent Recipients</CardTitle>
                  <CardDescription>Recently invited recipients and their RSVP status</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentRecipients />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="recipients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Recipients</CardTitle>
                <CardDescription>Manage all your event recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRecipients fullTable={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Trend</CardTitle>
                <CardDescription>RSVP responses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Overview interval={interval} isRsvpTrend={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
