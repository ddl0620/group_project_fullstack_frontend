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
import PostModal from './PostModal';
import { useDiscussionPost } from '@/hooks/useDiscussionPost.js';

const DiscussionThreadList = ({ eventId }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const {
        fetchPosts,
        pagination,
        loading,
        error,
        updatePost,
        deletePost,
    } = useDiscussionPost();

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
                return new Date(discussion.created_at) > oneWeekAgo;
            }
            return true;
        })
        : [];

    const handleEditPost = (post) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleUpdatePost = async (postData) => {
        try {
            await updatePost(editingPost._id, postData);
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(eventId, postId);
        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error);
        }
    };

    if (error) {
        return (
            <div className="py-12 text-center text-red-500">
                Lỗi: {error}
                <button
                    onClick={() => fetchPosts(eventId, 1, 10, true)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mb-6">
                <div className="flex space-x-4 border-b border-gray-200">
                    <button
                        className={`px-1 pb-2 ${
                            activeTab === 'all'
                                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        Tất cả thảo luận
                    </button>
                    <button
                        className={`px-1 pb-2 ${
                            activeTab === 'popular'
                                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('popular')}
                    >
                        Phổ biến
                    </button>
                    <button
                        className={`px-1 pb-2 ${
                            activeTab === 'recent'
                                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('recent')}
                    >
                        Gần đây
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-12 text-center">Đang tải...</div>
            ) : filteredDiscussions.length > 0 ? (
                <div className="space-y-4">
                    <div className="mb-4 text-gray-500">
                        Tổng cộng: {typeof pagination.total === 'number' ? pagination.total : 0} bài viết
                    </div>
                    {filteredDiscussions.map((discussion) => {
                        const creatorName = discussion.creator_id?._id
                        return (
                            <div
                                key={discussion._id}
                                className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                creatorName
                                            )}&background=random`}
                                            alt="Người tạo"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {discussion.content.slice(0, 30) + '...'}
                                            </h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditPost(discussion)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(discussion._id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Được tạo bởi {creatorName} •{' '}
                                            {new Date(discussion.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="mt-3 text-gray-700">{discussion.content}</p>
                                        {discussion.images && discussion.images.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {discussion.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt="Hình ảnh thảo luận"
                                                        className="h-16 w-16 rounded object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                                            <button className="flex items-center hover:text-blue-600">
                                                <ThumbsUp className="mr-1 h-4 w-4" />
                                                <span>{0}</span>
                                            </button>
                                            <div className="flex items-center">
                                                <MessageCircle className="mr-1 h-4 w-4" />
                                                <span>{0} phản hồi</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4" />
                                                <span>Phản hồi cuối: N/A</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        Chưa có thảo luận nào
                    </h3>
                    <p className="mt-1 text-gray-500">
                        Hãy là người đầu tiên bắt đầu một thảo luận cho sự kiện này.
                    </p>
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
