import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {LogOut, Search, User} from 'lucide-react';
export function CustomDropdown({ children, dropDownLabel, items }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus-visible:ring-ring rounded-full focus:outline-none focus-visible:ring-2">
                    {children}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="z-50 w-56 border border-gray-200 bg-white shadow-md"
            >
                {' '}
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium text-center py-1">
                            {dropDownLabel}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={"border border-gray-200 px-2"} />
                {
                    items && items.length > 0 && items.map((item, index) => (
                        <div key={index}>
                            <DropdownMenuItem
                                onClick={item.onClick}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </div>
                    ))
                }
                {/*<DropdownMenuItem onClick={() => {}} className="cursor-pointer hover:bg-gray-100">*/}
                {/*    <User className="mr-2 h-4 w-4" />*/}
                {/*    <span>Edit profile</span>*/}
                {/*</DropdownMenuItem>*/}
                {/*<DropdownMenuSeparator />*/}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
