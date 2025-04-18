import {Calendar, Plus, UserIcon} from "lucide-react";

const userItems = [
    // {
    //     header: "Setting",
    // },
    {
        title: "Profile",
        url: "/event/browse",
        icon: UserIcon,
    },
    {
        title: "Security",
        url: "/event",
        icon: Calendar,
    },
    {
        title: "Personal Information",
        url: "/event/create",
        icon: Plus,
    }
]

export default userItems;