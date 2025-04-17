import {Calendar, Home, Inbox, Plus, PlusIcon, Search, Settings, UserIcon} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.


export function AppSidebar({items}) {
    return (
        <Sidebar collapsible={"icon"} className={"pt-22 min-h-screen"}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className={"text-xl mb-10"}>Event Management</SidebarGroupLabel>
                    <SidebarGroupContent className="h-20">
                        <SidebarMenu className="gap-y-5">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.url === item.url}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}