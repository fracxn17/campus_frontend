import React, { useState } from 'react';
import { Search, Send, MoreVertical } from 'lucide-react';
import jayPhoto from '../assets/jay_prakash.jpg';

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-gray-200`}></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}

const conversations = [
  {
    id: 1,
    name: 'Jay Prakash Sharma',
    image: jayPhoto,
    lastMessage: 'Thanks for connecting!',
    timestamp: '2m ago',
    unread: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
    lastMessage: 'The event was great!',
    timestamp: '1h ago',
    unread: false,
  },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`flex items-start gap-3 p-4 cursor-pointer ${
                    selectedChat === conv.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <ImageWithFallback
                    src={conv.image}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-gray-900 truncate">{conv.name}</h4>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={selectedConversation.image}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-gray-900">{selectedConversation.name}</h3>
                      <p className="text-xs text-green-600">Active now</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="text-center text-gray-500 py-8">
                    Start of conversation with {selectedConversation.name}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
