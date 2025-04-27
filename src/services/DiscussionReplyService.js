// src/services/DiscussionPostService.js
import APIServices from '@/services/APIServices.js';

export const createNewReplyAPI = async (postId, content) => {
  const response = await APIServices.post(
    `/api/v1/discussion-replies/${postId}`,
    content
  );
  return response.data;
};
// {
//     "success": true,
//     "message": "Reply created successfully",
//     "content": {
//     "reply": {
//         "post_id": "680bcb48da87dc72a10348f9",
//             "parent_reply_id": null,
//             "content": "Mấy bạn giỏi quá",
//             "creator_id": "6801db125ac6f6873198f739",
//             "images": [
//             "https://i.ytimg.com/vi/TK4I4RTOjQo/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgUShHMA8=&rs=AOn4CLBvm1oFR0lAueoAqsfCM9_j5yfWfQ"
//         ],
//             "isDeleted": false,
//             "_id": "680d206fbd74f00e6443d1c1",
//             "created_at": "2025-04-26T18:05:35.421Z",
//             "updated_at": "2025-04-26T18:05:35.421Z",
//             "__v": 0
//     }
// }
// }

export const getAllRepliesAPI = async (postId, params = {}) => {
  const response = await APIServices.get(
    `/api/v1/discussion-replies/${postId}`,
    { params }
  );
  return response.data;
};
// {
//     "success": true,
//     "message": "Replies fetched successfully",
//     "content": {
//     "replies": [
//         {
//             "_id": "680d20dbbd74f00e6443d1cd",
//             "post_id": "680bcb48da87dc72a10348f9",
//             "parent_reply_id": "680d206fbd74f00e6443d1c1",
//             "content": "Giỏi con mẹ m",
//             "creator_id": {
//                 "_id": "6801db125ac6f6873198f739"
//             },
//             "images": [
//                 "https://i.ytimg.com/vi/TK4I4RTOjQo/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgUShHMA8=&rs=AOn4CLBvm1oFR0lAueoAqsfCM9_j5yfWfQ"
//             ],
//             "isDeleted": false,
//             "created_at": "2025-04-26T18:07:23.256Z",
//             "updated_at": "2025-04-26T18:07:23.256Z",
//             "__v": 0
//         },
//         {
//             "_id": "680d206fbd74f00e6443d1c1",
//             "post_id": "680bcb48da87dc72a10348f9",
//             "parent_reply_id": null,
//             "content": "Mấy bạn giỏi quá",
//             "creator_id": {
//                 "_id": "6801db125ac6f6873198f739"
//             },
//             "images": [
//                 "https://i.ytimg.com/vi/TK4I4RTOjQo/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgUShHMA8=&rs=AOn4CLBvm1oFR0lAueoAqsfCM9_j5yfWfQ"
//             ],
//             "isDeleted": false,
//             "created_at": "2025-04-26T18:05:35.421Z",
//             "updated_at": "2025-04-26T18:05:35.421Z",
//             "__v": 0
//         }
//     ]
// }
// }

export const getRepliedBy = async (replyId) => {
  const response = await APIServices.get(
    `/api/v1/discussion-replies/${replyId}/details`
  );
  return response.data;
};

export const updateReplyAPI = async (replyId, content) => {
  const response = await APIServices.put(
    `/api/v1/discussion-replies/${replyId}`,
    content
  );
  return response.data;
};

export const deleteReplyAPI = async (replyId) => {
  const response = await APIServices.delete(
    `/api/v1/discussion-replies/${replyId}`
  );
  return response.data;
};
