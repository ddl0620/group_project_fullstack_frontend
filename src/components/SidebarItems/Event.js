import {Calendar, Plus, UserIcon} from "lucide-react";

const eventItems = [
    {
        title: "All Events",
        url: "/event/browse",
        icon: UserIcon,
    },
    {
        title: "My Organized Events",
        url: "/event",
        icon: Calendar,
    },
    {
        title: "Create New Event",
        url: "/event/create",
        icon: Plus,
    }
]

export default eventItems;