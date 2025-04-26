// src/components/DiscussionThreadList.jsx
import { useState, useEffect } from 'react';
import {
    MessageSquare,
    ThumbsUp,
    MessageCircle,
    Clock,
    Edit,
    Trash,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import PostModal from './PostModal.jsx';
import { useDiscussionPost } from '@/hooks/useDiscussionPost.js';
import { DiscussionPost } from '@/pages/Discussion/DiscussionPost/DiscussionPost.jsx';
import EventDetails from '@/pages/Event/EventDetails.jsx';
import {CreateEditDiscussionPost} from "@/pages/Discussion/DiscussionPost/CreateEditDiscusisonPost.jsx";
import {useParams} from "react-router-dom";

const DiscussionThreadList = ({eventId}) => {
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const { fetchPosts, pagination, loading, error, updatePost, deletePost } =
        useDiscussionPost();
    const me = useSelector((state) => state.user.user);
    const posts = useSelector((state) => state.discussionPost.posts) || [];

    useEffect(() => {
        if (eventId) {
            fetchPosts(eventId, 1, 10);
        }
    }, [eventId, fetchPosts]);

    const filteredDiscussions = Array.isArray(posts)
        ? posts.filter((discussion) => {
              if (activeTab === 'all') return true;
              if (activeTab === 'recent') {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return discussion.creator_id._id === me._id;
              }
              return true;
          })
        : [];

    const handleUpdatePost = async (postData) => {
        try {
            await updatePost(editingPost._id, postData);
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
        }
    };

    const handleCreatePost = async () => {
        // Here you would typically send the data to your API
        try{

            const images = [];
            for(let image of allImages) {
                images.push(image.url);
            }

            const postData = {
                content: postContent,
                images: images
            }


            await createPost(eventId, postData)

            setPostContent('');
            setImageUrls([]);
            setUploadedImages([]);
            setCurrentImageUrl('');
            setIsModalOpen(false);
        }
        catch(err){
            console.error('Error creating post:', err);
        }
    };


    if (error) {
        return (
            <div className="py-12 text-center text-red-500 flex flex-col px-4">
                {error}
                {error !== "You are not authorized to access this event" ? (<button
                    onClick={() => fetchPosts(eventId, 1, 10, true)}
                    className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Thử lại
                </button>) : <></>}

            </div>
        );
    }

    return (
        <div className="overflow-y-auto bg-gray-50 p-6">
            {loading ? (
                <div className="py-12 text-center">Đang tải...</div>
            ) : filteredDiscussions.length > 0 ? (
                <div className="flex flex-col items-center justify-start space-y-4">
                    <div className="mb-4 text-gray-500">
                        Tổng cộng:{' '}
                        {typeof pagination.total === 'number'
                            ? pagination.total
                            : 0}{' '}
                        bài viết
                    </div>
                    <div className="fixed right-4 bottom-10 z-50">
                        <CreateEditDiscussionPost onSuccess={handleCreatePost}  eventId={eventId} />
                    </div>
                    {filteredDiscussions.map((discussion) => {
                        return <DiscussionPost postData={discussion} />;
                    })}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        Chưa có thảo luận nào
                    </h3>
                    <p className="mt-1 text-gray-500">
                        Hãy là người đầu tiên bắt đầu một thảo luận cho sự kiện
                        này.
                    </p>
                    <div className="mt-6">
                        <CreateEditDiscussionPost onSuccess={handleCreatePost}  eventId={eventId} />
                    </div>
                </div>
            )}
            <PostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPost(null);
                }}
                onSubmit={handleUpdatePost}
                initialData={editingPost || {}}
                eventId={eventId}
            />
        </div>
    );
};

export default DiscussionThreadList;
