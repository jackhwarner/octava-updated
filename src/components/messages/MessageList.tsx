import { ScrollArea } from '../ui/scroll-area';
import type { Message } from '../../hooks/useMessages';

interface MessageListProps {
  messages: Message[];
  isCurrentUser: (senderId: string) => boolean;
  formatDistanceToNow: (date: Date, options?: any) => string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({
  messages,
  isCurrentUser,
  formatDistanceToNow,
  messagesEndRef,
}: MessageListProps) => (
  <ScrollArea className="flex-1 p-4">
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages in this conversation yet
        </div>
      ) : (
        [...messages].reverse().map((message) => {
          const isMyMessage = isCurrentUser(message.sender_id);
          const senderName = message.sender_profile?.name || message.sender_profile?.username || 'Unknown';
          
          return (
            <div key={message.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isMyMessage
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!isMyMessage && (
                  <p className="text-xs font-medium mb-1 opacity-75">
                    {senderName}
                  </p>
                )}
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMyMessage ? 'text-purple-200' : 'text-gray-500'
                  }`}
                >
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  </ScrollArea>
);

export default MessageList;
