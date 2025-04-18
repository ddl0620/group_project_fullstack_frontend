"use client"

import { useState } from "react"
import { MessageSquare, ThumbsUp, MessageCircle, Clock } from "lucide-react"
import { mockDiscussions } from "./mockData"

const DiscussionThreadList = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState("all")

  // Filter discussions by event ID
  const eventDiscussions = mockDiscussions.filter((discussion) => discussion.eventId === eventId)

  // Further filter based on active tab
  const filteredDiscussions = eventDiscussions.filter((discussion) => {
    if (activeTab === "all") return true
    if (activeTab === "popular") return discussion.likes > 5
    if (activeTab === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return new Date(discussion.createdAt) > oneWeekAgo
    }
    return true
  })

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`pb-2 px-1 ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Discussions
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "popular"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("popular")}
          >
            Popular
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "recent"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("recent")}
          >
            Recent
          </button>
        </div>
      </div>

      {filteredDiscussions.length > 0 ? (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      discussion.author.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.author.name)}&background=random`
                    }
                    alt={discussion.author.name}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{discussion.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Started by {discussion.author.name} • {new Date(discussion.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-3 text-gray-700">{discussion.content}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center hover:text-blue-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{discussion.likes}</span>
                    </button>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last reply {discussion.lastReplyTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No discussions yet</h3>
          <p className="mt-1 text-gray-500">Be the first to start a discussion for this event.</p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Start a Discussion
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscussionThreadList
