
import { CardHeader, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Search } from 'lucide-react';

interface ConversationListProps {
  threads: any[];
  selectedThreadId: string | null;
  handleThreadClick: (threadId: string) => void;
  getOtherParticipant: (thread: any) => any;
  formatDistanceToNow: (date: Date, options?: any) => string;
}

const ConversationList = ({
  threads,
  selectedThreadId,
  handleThreadClick,
  getOtherParticipant,
  formatDistanceToNow,
}: ConversationListProps) => (
  <div className="flex flex-col w-72 min-w-[220px] max-w-xs bg-white">
    <CardHeader className="border-b">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Search messages..." className="pl-9" />
      </div>
    </CardHeader>
    <CardContent className="p-0 flex-1 flex flex-col">
      <ScrollArea className="flex-1 h-96">
        {threads.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {threads.map((thread) => {
              const otherParticipant = getOtherParticipant(thread);
              return (
                <li
                  key={thread.id}
                  role="listitem"
                  onClick={() => handleThreadClick(thread.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedThreadId === thread.id ? 'bg-purple-50 border-r-2 border-r-purple-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {thread.is_group ? (
                      // Only local import allowed for GroupAvatar
                      // ... (the parent still imports GroupAvatar, so skip here)
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        ?
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {otherParticipant?.name?.[0] || otherParticipant?.username?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">
                          {thread.name || otherParticipant?.name || otherParticipant?.username || 'Unknown'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {thread.latest_message && formatDistanceToNow(new Date(thread.latest_message.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {thread.latest_message?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </CardContent>
  </div>
);

export default ConversationList;
