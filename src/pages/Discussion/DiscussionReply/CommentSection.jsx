"use client"

import { useState, useEffect } from "react"
import { Heart, Reply, MoreHorizontal, X, Send, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Comment from "@/pages/Discussion/DiscussionReply/Comment.jsx";
// Mock user data - in a real app, this would come from authentication
const currentUser = {
    _id: "6801db125ac6f6873198f739", // Matching the creator_id in the sample data
    name: "Current User",
    avatar: "/vibrant-street-market.png",
}

// Function to organize replies into a tree structure
const organizeRepliesIntoTree = (replies) => {
    // Create a map of all replies by their ID for quick lookup
    const replyMap = new Map()
    replies.forEach((reply) => {
        replyMap.set(reply._id, { ...reply, children: [] })
    })

    // Root level replies (direct replies to the post)
    const rootReplies = []

    // Organize replies into a tree structure
    replies.forEach((reply) => {
        const replyWithChildren = replyMap.get(reply._id)

        if (reply.parent_reply_id === null) {
            // This is a root level reply (direct reply to the post)
            rootReplies.push(replyWithChildren)
        } else {
            // This is a reply to another reply
            const parentReply = replyMap.get(reply.parent_reply_id)
            if (parentReply) {
                parentReply.children.push(replyWithChildren)
            }
        }
    })

    return rootReplies
}

// Main Comment Section Component
export function CommentSection({ postId, initialReplies = [] }) {
    const [replies, setReplies] = useState([])
    const [newComment, setNewComment] = useState("")
    const [commentImages, setCommentImages] = useState([])
    const [showImageInput, setShowImageInput] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [treeStructure, setTreeStructure] = useState([])

    // Initialize with provided replies
    useEffect(() => {
        if (initialReplies.length > 0) {
            setReplies(initialReplies)
            const tree = organizeRepliesIntoTree(initialReplies)
            setTreeStructure(tree)
        }
    }, [initialReplies])

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setCommentImages([...commentImages, imageUrl])
            setImageUrl("")
            setShowImageInput(false)
        }
    }

    const handleRemoveImage = (index) => {
        const updatedImages = [...commentImages]
        updatedImages.splice(index, 1)
        setCommentImages(updatedImages)
    }

    const handleAddComment = () => {
        if (newComment.trim() === "" && commentImages.length === 0) return

        // Create a new comment
        const newReply = {
            _id: `temp-${Date.now()}`, // Temporary ID, would be replaced by server-generated ID
            post_id: postId,
            parent_reply_id: null, // Root level comment
            content: newComment,
            creator_id: {
                _id: currentUser._id,
            },
            images: commentImages,
            isDeleted: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            children: [], // No children initially
        }

        // Add to replies and update tree structure
        const updatedReplies = [...replies, newReply]
        setReplies(updatedReplies)
        setTreeStructure(organizeRepliesIntoTree(updatedReplies))

        // Reset form
        setNewComment("")
        setCommentImages([])
    }

    const handleReply = (replyData) => {
        // Create a new reply
        const newReply = {
            _id: `temp-${Date.now()}`, // Temporary ID, would be replaced by server-generated ID
            post_id: replyData.post_id,
            parent_reply_id: replyData.parent_reply_id,
            content: replyData.content,
            creator_id: {
                _id: currentUser._id,
            },
            images: replyData.images,
            isDeleted: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        // Add to replies and update tree structure
        const updatedReplies = [...replies, newReply]
        setReplies(updatedReplies)
        setTreeStructure(organizeRepliesIntoTree(updatedReplies))
    }

    const handleDeleteComment = (commentId) => {
        // Filter out the deleted comment
        const updatedReplies = replies.filter((reply) => reply._id !== commentId)
        setReplies(updatedReplies)
        setTreeStructure(organizeRepliesIntoTree(updatedReplies))
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-lg">Comments ({replies.length})</h3>

            {/* New comment input */}
            <div className="space-y-3">
                <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </div>
                </div>

                {/* Image preview */}
                {commentImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {commentImages.map((image, index) => (
                            <div key={index} className="relative h-20 w-20">
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Image ${index + 1}`}
                                    className="h-full w-full rounded object-cover"
                                    onError={(e) => {
                                        e.target.src = "/colorful-abstract-flow.png"
                                    }}
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-1 -right-1 rounded-full bg-black bg-opacity-70 p-0.5 text-white"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Image URL input */}
                {showImageInput && (
                    <div className="flex gap-2">
                        <Input placeholder="Paste image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        <Button onClick={handleAddImage}>Add</Button>
                    </div>
                )}

                <div className="flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setShowImageInput(!showImageInput)}>
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Add Image
                    </Button>

                    <Button onClick={handleAddComment} disabled={newComment.trim() === "" && commentImages.length === 0}>
                        Comment
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Comments list */}
            <div className="space-y-4">
                {treeStructure.length > 0 ? (
                    treeStructure.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onReply={handleReply}
                            onDelete={handleDeleteComment}
                            currentUserId={currentUser._id}
                            postId={postId}
                        />
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    )
}
