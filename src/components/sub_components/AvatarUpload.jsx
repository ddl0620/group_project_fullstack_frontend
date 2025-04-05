import { useState } from 'react';
import { Sparkles } from 'lucide-react';

function AvatarUpload({ currentAvatar }) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [isHovering, setIsHovering] = useState(false);
  
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
      <div className="flex items-center justify-center gap-6">
        {/* Current Avatar Circle - No hover effects or edit functionality */}
        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 relative">
          {avatar ? (
            <img 
              src={avatar} 
              alt="Profile avatar" 
              className="h-full w-full object-cover text-center pt-5"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 ">
              <span className="text-xl font-medium">SC</span>
            </div>
          )}
        </div>
        
        {/* Generate AI Avatar Circle - With hover effects and upload functionality */}
        <div
          className="h-24 w-24 rounded-full border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
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
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          >
            <span className="sr-only">Upload avatar</span>
          </label>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Upload / Generate a new avatar</p>
    </div>
  );
}

export default AvatarUpload;
