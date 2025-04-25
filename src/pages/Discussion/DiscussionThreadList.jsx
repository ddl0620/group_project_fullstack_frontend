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
import { DiscussionPost } from '@/components/DiscussionPost.jsx';
import EventDetails from '@/pages/Event/EventDetails.jsx';
import { CreateNewDiscussionPost } from '@/pages/Discussion/CreateNewDiscusisonPost.jsx';

const DiscussionThreadList = ({ eventId }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const { fetchPosts, pagination, loading, error, updatePost, deletePost } =
        useDiscussionPost();

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
                    className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {/*<div className="mb-6">*/}
            {/*    <div className="flex space-x-4 border-b border-gray-200">*/}
            {/*        <button*/}
            {/*            className={`px-1 pb-2 ${*/}
            {/*                activeTab === 'all'*/}
            {/*                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'*/}
            {/*                    : 'text-gray-500 hover:text-gray-700'*/}
            {/*            }`}*/}
            {/*            onClick={() => setActiveTab('all')}*/}
            {/*        >*/}
            {/*            All Discussion*/}
            {/*        </button>*/}
            {/*        <button*/}
            {/*            className={`px-1 pb-2 ${*/}
            {/*                activeTab === 'popular'*/}
            {/*                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'*/}
            {/*                    : 'text-gray-500 hover:text-gray-700'*/}
            {/*            }`}*/}
            {/*            onClick={() => setActiveTab('popular')}*/}
            {/*        >*/}
            {/*            Popular*/}
            {/*        </button>*/}
            {/*        <button*/}
            {/*            className={`px-1 pb-2 ${*/}
            {/*                activeTab === 'recent'*/}
            {/*                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'*/}
            {/*                    : 'text-gray-500 hover:text-gray-700'*/}
            {/*            }`}*/}
            {/*            onClick={() => setActiveTab('recent')}*/}
            {/*        >*/}
            {/*            Recents*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

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
                        <CreateNewDiscussionPost eventId={eventId} />
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
