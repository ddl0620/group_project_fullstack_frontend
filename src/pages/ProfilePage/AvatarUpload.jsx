import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import {CustomAvatar} from "@/components/shared/CustomAvatar.jsx";
import {useSelector} from "react-redux";

function AvatarUpload({ currentAvatar }) {
    const [avatar, setAvatar] = useState(currentAvatar);
    const [isHovering, setIsHovering] = useState(false);
    const {user} = useSelector((state) => state.user);
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Two circles container */}
            <div className="flex items-center justify-center gap-10">
                <div className="scale-230">
                  <CustomAvatar src={avatar} alt={user?.avatar} fallbackText={user?.name} />
                </div>

                {/* Generate AI Avatar Circle - With hover effects and upload functionality */}
                <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {isHovering ? (
                        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    ) : (
                        <Sparkles className="h-6 w-6 text-gray-500" />
                    )}

                    <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    >
                        <span className="sr-only">Upload avatar</span>
                    </label>
                </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
                Upload / Generate a new avatar
            </p>
        </div>
    );
}

export default AvatarUpload;
