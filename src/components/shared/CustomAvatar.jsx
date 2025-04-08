import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const getInitials = (name) => {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

export function CustomAvatar({
    src = 'https://github.com/shadcn.png',
    alt = '@shadcn',
    fallbackText = 'CN',
}) {
    return (
        <Avatar className="border-border h-10 w-10 cursor-pointer transition-opacity hover:opacity-80">
            <AvatarImage src={src} alt={alt} />
            <AvatarFallback>{getInitials(fallbackText)}</AvatarFallback>
        </Avatar>
    );
}
