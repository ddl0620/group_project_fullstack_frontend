// src/components/PostModal.jsx
import { useState, useEffect } from 'react';
import { X, Image, PlusCircle } from 'lucide-react';

const PostModal = ({ isOpen, onClose, onSubmit, initialData = {}, eventId }) => {
    const [content, setContent] = useState(initialData.content || '');
    const [images, setImages] = useState(initialData.images || []);
    const [imageUrls, setImageUrls] = useState([]); // For now, we'll use URLs as a placeholder for image uploads

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content || '');
            setImages(initialData.images || []);
        }
    }, []);

    const handleImageAdd = (e) => {
        const url = e.target.value;
        if (url) {
            setImageUrls([...imageUrls, url]);
            setImages([...images, url]); // In a real app, you'd upload the image and get a URL
            e.target.value = '';
        }
    };

    const handleImageRemove = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setImageUrls(newImages);
    };

    const handleSubmit = () => {
        onSubmit({ content, images, eventId });
        setContent('');
        setImages([]);
        setImageUrls([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {initialData._id ? 'Edit Discussion Post' : 'Create New Discussion Post'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your discussion post..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Images (URLs)</label>
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter image URL..."
                            onKeyDown={(e) => e.key === 'Enter' && handleImageAdd(e)}
                        />
                        <button
                            onClick={(e) => handleImageAdd({ target: e.currentTarget.previousSibling })}
                            className="ml-2 text-blue-600 hover:text-blue-700"
                        >
                            <PlusCircle className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={image} alt="Preview" className="h-16 w-16 object-cover rounded" />
                                <button
                                    onClick={() => handleImageRemove(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {initialData._id ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;