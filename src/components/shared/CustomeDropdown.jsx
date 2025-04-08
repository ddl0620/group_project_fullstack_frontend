'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {LogOut, Search, User} from 'lucide-react';
export function CustomDropdown({ children, dropDownMenuLabel, items }) {
    // return (
    //     <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //             <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
    //                 {children}
    //             </button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="w-56">
    //             {/*<DropdownMenuLabel>*/}
    //             {/*    <div className="flex flex-col space-y-1">*/}
    //             {/*        <p className="text-sm font-medium leading-none">{user.name}</p>*/}
    //             {/*        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>*/}
    //             {/*    </div>*/}
    //             {/*</DropdownMenuLabel>*/}
    //
    //             {/*DropdownMenuLabel is like above*/}
    //
    //
    //             {dropDownMenuLabel && (dropDownMenuLabel)}
    //             {
    //                 items?.map((item, index) => (
    //                     <div>
    //                         <DropdownMenuSeparator />
    //                         <DropdownMenuItem key={index} onClick={item?.onClick} className="cursor-pointer">
    //                             {item?.icon}
    //                             <span>{item.label}</span>
    //                         </DropdownMenuItem>
    //                     </div>
    //                 ))
    //             }
    //         </DropdownMenuContent>
    //     </DropdownMenu>
    // )

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
                        <p className="text-sm leading-none font-medium">
                            {'Khong Quoc Khanh'}
                        </p>
                        <p className="text-muted-foreground text-xs leading-none">
                            {'khanhquoc1125'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={"border border-gray-200 px-2"} />
                <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {}}
                    className="text-destructive focus:text-destructive cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
