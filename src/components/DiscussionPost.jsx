'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { useUser } from '@/hooks/useUser.js';
import {useSelector} from "react-redux";

// Mock data for the post
// const postData = {
//     _id: '680826be2a742860cb232bf4c',
//     content: 'Ai đi 30/4 ko? Ký nam trò',
//     created_at: '2025-04-18T15:10:50.082Z',
//     creator_id: '6801db125ac5fc687319bf739',
//     event_id: '6801dafc5ac5fc687319bf736',
//     images: [
//         'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh73LMyo9vVS974D9Gv8R9hkb5707hG2xUccCUP2FzmWG3D0fFkvWtdkvkFigPooBOMBv2QnR4TKG2EfPjmVYnb0CBslO1VW7bbAMDjDNYShhQMb2mg3ZZbF4x_lrQGaymmdL-Bp3-7qRoNaJT4RfNDiRNmHV6VIl87S2qKli9wEFUe4u7jR6g8B4cgREs/s16000-rw/anh-30-4.jpg',
//         'https://vnpt.com.vn/Media/Images/24042024/tinh-than-30-thang-4.png',
//         'https://kenh14cdn.com/203336854389633024/2025/4/15/img6239-17446854812561262644741-1744686003628-17446860042171242336120-1744690135519-1744690135650632899270.jpg',
//     ],
//     isDeleted: false,
//     updated_at: '2025-04-18T15:10:50.082Z',
//     creator: {
//         name: 'Quốc Khánh',
//         username: 'qckhanh',
//         avatar: 'https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/avatar-30-4-2.jpg',
//     },
// };

// Mock data for comments
const mockComments = [
    {
        id: 'comment1',
        content: 'Great post! Love the photos.',
        created_at: '2025-04-18T16:15:30.082Z',
        user: {
            name: 'Alice Smith',
            username: 'alicesmith',
            avatar: '/contemplative-artist.png',
        },
        likes: 5,
        replies: [
            {
                id: 'reply1',
                content: 'I agree, the photos are amazing!',
                created_at: '2025-04-18T17:20:10.082Z',
                user: {
                    name: 'Bob Johnson',
                    username: 'bobjohnson',
                    avatar: '/contemplative-man.png',
                },
                likes: 2,
            },
        ],
    },
    {
        id: 'comment2',
        content: 'Where was this taken?',
        created_at: '2025-04-18T18:05:45.082Z',
        user: {
            name: 'Emma Davis',
            username: 'emmadavis',
            avatar: '/placeholder.svg?key=n6vdj',
        },
        likes: 3,
        replies: [],
    },
];

// Recursive comment component that can handle unlimited nesting
const Comment = ({ comment, onReply, path = [] }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes || 0);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
    };

    const handleReplySubmit = () => {
        if (replyContent.trim() === '') return;

        onReply(path, replyContent);
        setReplyContent('');
        setShowReplyInput(false);
    };

    return (
        <div className={`${path.length > 0 ? 'mt-2 ml-8' : 'mt-4'}`}>
            <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={comment.user.avatar || '/placeholder.svg'}
                        alt={comment.user.name}
                    />
                    <AvatarFallback>
                        {comment.user.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="bg-muted rounded-lg p-2">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold">
                                {comment.user.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                @{comment.user.username}
                            </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
                        <span>
                            {formatDistanceToNow(new Date(comment.created_at), {
                                addSuffix: true,
                            })}
                        </span>
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 ${liked ? 'text-primary' : ''}`}
                        >
                            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                        </button>
                        <button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                        >
                            Reply
                        </button>
                    </div>
                    {showReplyInput && (
                        <div className="mt-2 flex gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage
                                    src="/diverse-group-city.png"
                                    alt="Current user"
                                />
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Write a reply..."
                                        className="h-8 text-sm"
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleReplySubmit();
                                            }
                                        }}
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-2"
                                        onClick={handleReplySubmit}
                                        disabled={replyContent.trim() === ''}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply, index) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            path={[...path, index]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export function DiscussionPost({ postData }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(124);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [creator, setCreator] = useState({name: "User"});
    // Display only 2 comments when collapsed
    const visibleComments = showAllComments ? comments : comments.slice(0, 2);
    const { getUserById } = useUser();
    const me = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchUserData = async (userId) => {
            const response = await getUserById(userId);
            const user = response.content;
            setCreator(user);
        };
        fetchUserData(postData.creator_id._id);
        console.log(postData.creator_id._id);
    }, []);

    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
    };

    const isMewPost = me._id === postData.creator_id._id;

    const handleAddComment = () => {
        if (newComment.trim() === '') return;

        const comment = {
            id: `comment${comments.length + 1}`,
            content: newComment,
            created_at: new Date().toISOString(),
            user: {
                name: 'Current User',
                username: 'currentuser',
                avatar: '/diverse-group-city.png',
            },
            likes: 0,
            replies: [],
        };

        setComments([...comments, comment]);
        setNewComment('');
    };

    // Recursive function to add a reply at any nesting level
    const handleReply = (path, content) => {
        const newReply = {
            id: `reply-${Date.now()}`,
            content: content,
            created_at: new Date().toISOString(),
            user: {
                name: 'Current User',
                username: 'currentuser',
                avatar: '/diverse-group-city.png',
            },
            likes: 0,
            replies: [],
        };

        // Create a deep copy of the comments array
        const updatedComments = JSON.parse(JSON.stringify(comments));

        // If path is empty, it's a top-level comment
        if (path.length === 0) {
            updatedComments.push(newReply);
        } else {
            // Navigate to the correct comment using the path
            let current = updatedComments[path[0]];
            for (let i = 1; i < path.length; i++) {
                current = current.replies[path[i]];
            }

            // Add the reply to the current comment's replies
            if (!current.replies) {
                current.replies = [];
            }
            current.replies.push(newReply);
        }

        setComments(updatedComments);
    };

    return (
        <Card className="mx-auto max-w-2xl rounded-lg bg-white shadow-md sm:w-sm md:w-md lg:w-lg xl:w-xl">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                <CustomAvatar
                    src={''}
                    fallbackText={creator.name}
                    alt={'User'}
                />
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold">{creator.name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(postData.created_at), {
                            addSuffix: true,
                        })}
                    </span>
                </div>
                {isMewPost ? (<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>) : <></>}
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4 pt-0">
                <p className="w-full">{postData.content}</p>
                {postData.images.length > 0 && (
                    <Carousel className="mt-4 w-full">
                        <CarouselContent>
                            {postData.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="overflow-hidden rounded-lg">
                                        <img
                                            src={image || '/placeholder.svg'}
                                            alt={`Post image ${index + 1}`}
                                            className="aspect-video w-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                )}
            </CardContent>
            <CardFooter className="flex flex-col p-0">
                <div className="flex w-full items-center justify-start gap-x-4 p-4">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLike}
                            className={liked ? 'text-red-500' : ''}
                        >
                            <Heart
                                className={`h-5 w-5 ${liked ? 'fill-current' : ''}`}
                            />
                            <span className="sr-only">Like</span>
                        </Button>
                        <span className="text-sm">{likeCount}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span>{comments.length} comments</span>
                    </Button>
                </div>
                {showComments && (
                    <div className="w-full border-t p-4">
                        <div className="flex gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="/diverse-group-city.png"
                                    alt="Current user"
                                />
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddComment();
                                            }
                                        }}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleAddComment}
                                        disabled={newComment.trim() === ''}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {comments.length > 2 && (
                            <div className="mt-4 mb-2 flex items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-xs"
                                    onClick={() =>
                                        setShowAllComments(!showAllComments)
                                    }
                                >
                                    {showAllComments ? (
                                        <>
                                            <ChevronUp className="h-4 w-4" />
                                            See less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4" />
                                            See all {comments.length} comments
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <Separator className="my-4" />
                        <div className="space-y-2">
                            {visibleComments.map((comment, index) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    onReply={handleReply}
                                    path={[index]}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
