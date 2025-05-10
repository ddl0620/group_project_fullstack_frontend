import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const getInitials = (name) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export function CustomAvatar({
  src = "",
  alt = 'User',
  fallbackText = 'A',
  _classname = '',
}) {
  return (
    <Avatar
      className={`border-border cursor-pointer border transition-opacity hover:opacity-80 ${_classname}`}
    >
      <AvatarImage src={src || "/rmit.png"} alt={alt} />
      <AvatarFallback className={"text-[12px] font-semibold"}>{getInitials(fallbackText)}</AvatarFallback>
    </Avatar>
  );
}
