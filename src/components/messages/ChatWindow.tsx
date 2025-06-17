import { CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

interface ChatWindowProps {
  selectedThread: any;
  threadMessages: any[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isCurrentUser: (senderId: string) => boolean;
  formatDistanceToNow: (date: Date, options?: any) => string;
  newMessage: string;
  setNewMessage: (m: string) => void;
  handleSendMessage: () => Promise<void>;
  handleEditChatName: () => void;
  handleDeleteChat: () => void;
  handleReportChat: () => void;
  getOtherParticipant: (thread: any) => any;
}

const ChatWindow = ({
  selectedThread,
  threadMessages,
  messagesEndRef,
  isCurrentUser,
  formatDistanceToNow,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleEditChatName,
  handleDeleteChat,
  handleReportChat,
  getOtherParticipant,
}: ChatWindowProps) => {
  const otherParticipant = getOtherParticipant(selectedThread);
  const displayName = otherParticipant?.profiles?.name || otherParticipant?.profiles?.username || 'Unknown';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <ChatHeader
        selectedThread={selectedThread}
        getOtherParticipant={getOtherParticipant}
        handleEditChatName={handleEditChatName}
        handleDeleteChat={handleDeleteChat}
        handleReportChat={handleReportChat}
      />
      <CardContent className="flex-1 flex flex-col p-0">
        <MessageList
          messages={threadMessages}
          isCurrentUser={isCurrentUser}
          formatDistanceToNow={formatDistanceToNow}
          messagesEndRef={messagesEndRef}
        />
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Message ${displayName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default ChatWindow;
