import CustomNotification from '@/components/sub_components/CustomNotification.jsx';
import {CustomAvatar} from "@/components/shared/CustomAvatar.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {CustomDropdown} from "@/components/shared/CustomeDropdown.jsx";
const dropdownmenu =[
    {
        label: "Edit profile",
        icon: "",
        onClick: () => {
            console.log("Edit profile");
        },
    }
]
const App2 = () => {
    return (
        <div className="flex min-h-screen flex-row items-center gap-3">
            <CustomNotification
                name={'Khong Quoc Khanh'}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                icon={<CustomAvatar/>}
                color="#1E86FF"
                time="2m ago"
            />

            <CustomDropdown children={<CustomAvatar/>} items={dropdownmenu} />



        </div>
    );
};

export default App2;
