import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const getInitials = (name) => {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

export function CustomAvatar({
    src = '',
    alt = 'User',
    fallbackText = 'A',
    _classname = '',
}) {
    return (
        <Avatar className={`border-border h-10 w-10 cursor-pointer transition-opacity hover:opacity-80 border ${_classname}`}>
            <AvatarImage src={src} alt={alt} />
            <AvatarFallback>{getInitials(fallbackText)}</AvatarFallback>
        </Avatar>
    );
}
