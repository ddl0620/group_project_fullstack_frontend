"use client"

import { useState, useRef, useEffect } from "react"
import { PlusIcon, FileIcon, X, Link, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import useDiscussionPost from "@/hooks/useDiscussionPost"

export function CreateEditDiscussionPost({
                                             eventId,
                                             isEdit = false,
                                             postData = null,
                                             onSuccess = () => {},
                                             triggerButton = null,
                                         }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [postContent, setPostContent] = useState("")
    const [imageUrls, setImageUrls] = useState([])
    const [uploadedImages, setUploadedImages] = useState([])
    const [currentImageUrl, setCurrentImageUrl] = useState("")
    const fileInputRef = useRef(null)
    const { createPost, updatePost } = useDiscussionPost()

    // Initialize form with existing data if in edit mode
    useEffect(() => {
        if (isEdit && postData && isModalOpen) {
            setPostContent(postData.content || "")

            // Handle existing images
            const existingImages = postData.images || []
            setImageUrls(existingImages.map((url) => ({ url, type: "url" })))
            setUploadedImages([])
        }
    }, [isEdit, postData, isModalOpen])

    // Reset form when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            if (!isEdit) {
                setPostContent("")
                setImageUrls([])
                setUploadedImages([])
                setCurrentImageUrl("")
            }
        }
    }, [isModalOpen, isEdit])

    // Handle file upload
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            type: "file",
        }))

        setUploadedImages([...uploadedImages, ...newImages])
    }

    // Handle image URL addition
    const handleAddImageUrl = () => {
        if (!currentImageUrl.trim()) return

        setImageUrls([...imageUrls, { url: currentImageUrl, type: "url" }])
        setCurrentImageUrl("")
    }

    // Remove an image (either uploaded or URL)
    const handleRemoveImage = (index, type) => {
        if (type === "file") {
            const newUploadedImages = [...uploadedImages]

            // Revoke the object URL to avoid memory leaks
            URL.revokeObjectURL(newUploadedImages[index].url)

            newUploadedImages.splice(index, 1)
            setUploadedImages(newUploadedImages)
        } else {
            const newImageUrls = [...imageUrls]
            newImageUrls.splice(index, 1)
            setImageUrls(newImageUrls)
        }
    }

    // Combine all images for preview
    const allImages = [
        ...uploadedImages.map((img) => ({ ...img, type: "file" })),
        ...imageUrls.map((img) => ({ ...img, type: "url" })),
    ]

    // Handle post submission (create or update)
    const handleSubmitPost = async () => {
        try {
            const images = allImages.map((image) => image.url)

            const postPayload = {
                content: postContent,
                images: images,
            }

            if (isEdit && postData) {
                await updatePost(postData._id, postPayload)
            } else {
                await createPost(eventId, postPayload)
            }

            // Reset form and close modal
            setPostContent("")
            setImageUrls([])
            setUploadedImages([])
            setCurrentImageUrl("")
            setIsModalOpen(false)

            // Notify parent component of success
            onSuccess()
        } catch (err) {
            console.error(`Error ${isEdit ? "updating" : "creating"} post:`, err)
        }
    }

    // Default trigger button if none provided
    const defaultTrigger = (
        <Button variant="default" size="default">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Discussion
        </Button>
    )

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
            <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
                <DialogHeader>
                    <DialogTitle className="font-bold">{isEdit ? "Edit Discussion" : "New Discussion"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update your post" : "Create a new post to share with others."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                    {/* Post Content */}
                    <div className="space-y-2">
                        <Label htmlFor="postContent">What's on your mind?</Label>
                        <Textarea
                            id="postContent"
                            placeholder="Share your thoughts..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>

                    {/* Image Upload Tabs */}
                    <div className="space-y-2">
                        <Label>Add Images</Label>
                        <Tabs defaultValue="upload" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Upload Images
                                </TabsTrigger>
                                <TabsTrigger value="url">
                                    <Link className="mr-2 h-4 w-4" />
                                    Image URLs
                                </TabsTrigger>
                            </TabsList>

                            {/* Upload Tab */}
                            <TabsContent value="upload" className="space-y-4">
                                <Card>
                                    <CardContent className="p-6">
                                        <div
                                            className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-200 p-6 transition-colors hover:bg-gray-50"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <FileIcon className="h-12 w-12" />
                                            <span className="text-sm font-medium text-gray-500">Drag and drop images or click to browse</span>
                                            <span className="text-xs text-gray-500">Select multiple images (up to 10)</span>
                                            <Input
                                                ref={fileInputRef}
                                                id="file"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Uploaded Images Preview */}
                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {uploadedImages.map((image, index) => (
                                            <div key={index} className="group relative">
                                                <img
                                                    src={image.url || "/placeholder.svg"}
                                                    alt={`Uploaded ${index}`}
                                                    className="h-24 w-full rounded-md object-cover"
                                                />
                                                <button
                                                    className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                    onClick={() => handleRemoveImage(index, "file")}
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <span className="bg-opacity-50 absolute bottom-1 left-1 max-w-[90%] truncate rounded bg-black px-1 text-xs text-white">
                          {image.name}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* URL Tab */}
                            <TabsContent value="url" className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Paste image URL here"
                                        value={currentImageUrl}
                                        onChange={(e) => setCurrentImageUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddImageUrl()}
                                    />
                                    <Button onClick={handleAddImageUrl} type="button">
                                        Add
                                    </Button>
                                </div>

                                {/* URL Images Preview */}
                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {imageUrls.map((image, index) => (
                                            <div key={index} className="group relative">
                                                <img
                                                    src={image.url || "/placeholder.svg"}
                                                    alt={`URL ${index}`}
                                                    className="h-24 w-full rounded-md object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/abstract-geometric-shapes.png"
                                                        e.target.alt = "Invalid image URL"
                                                    }}
                                                />
                                                <button
                                                    className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                    onClick={() => handleRemoveImage(index, "url")}
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <span className="bg-opacity-50 absolute bottom-1 left-1 max-w-[90%] truncate rounded bg-black px-1 text-xs text-white">
                          URL
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Post Preview */}
                    {(postContent || allImages.length > 0) && (
                        <div className="space-y-2">
                            <Label>Post Preview</Label>
                            <Card className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="mb-3 flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src="/diverse-group-city.png" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">Current User</div>
                                            <div className="text-muted-foreground text-xs">
                                                {formatDistanceToNow(new Date(), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>

                                    {postContent && <p className="mb-3">{postContent}</p>}

                                    {allImages.length > 0 && (
                                        <div className={`grid ${allImages.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                                            {allImages.slice(0, 4).map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={`${allImages.length === 3 && index === 0 ? "col-span-2" : ""} ${
                                                        allImages.length === 1 ? "max-h-80" : "max-h-40"
                                                    } overflow-hidden rounded-md`}
                                                >
                                                    <img
                                                        src={image.url || "/placeholder.svg"}
                                                        alt={`Preview ${index}`}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/abstract-geometric-shapes.png"
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            {allImages.length > 4 && (
                                                <div className="relative col-span-1">
                                                    <img
                                                        src={allImages[4].url || "/placeholder.svg"}
                                                        alt={`Preview 4`}
                                                        className="h-full w-full rounded-md object-cover opacity-80"
                                                        onError={(e) => {
                                                            e.target.src = "/abstract-geometric-shapes.png"
                                                        }}
                                                    />
                                                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-black">
                                                        <span className="font-medium text-white">+{allImages.length - 4} more</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4 flex-shrink-0">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitPost} disabled={!postContent && allImages.length === 0}>
                        {isEdit ? "Update Post" : "Create Post"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
