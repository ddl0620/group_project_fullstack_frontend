import {Calendar, Plus, UserIcon} from "lucide-react";

const settingItems = [
    // {
    //     header: "Setting",
    // },
    {
        title: "Basic Information",
        url: "/profile/edit",
        icon: UserIcon,
    },
    {
        title: "Password",
        url: "/profile/password",
        icon: Calendar,
    },
    {
        title: "Email",
        url: "/profile/email",
        icon: Plus,
    }
]

export default settingItems;