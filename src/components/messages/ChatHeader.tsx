
import { CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Trash2, Flag, Edit } from 'lucide-react';
import GroupAvatar from '../GroupAvatar';

interface ChatHeaderProps {
  selectedThread: any;
  getOtherParticipant: (thread: any) => any;
  handleEditChatName: () => void;
  handleDeleteChat: () => void;
  handleReportChat: () => void;
}

const ChatHeader = ({
  selectedThread,
  getOtherParticipant,
  handleEditChatName,
  handleDeleteChat,
  handleReportChat
}: ChatHeaderProps) => (
  <CardHeader className="border-b">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {selectedThread.is_group ? (
          <GroupAvatar
            participants={selectedThread.participants?.map((p: any) => ({
              name: p.profiles?.name,
              username: p.profiles?.username
            })) || []}
            size="md"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {getOtherParticipant(selectedThread)?.name?.[0] || getOtherParticipant(selectedThread)?.username?.[0] || '?'}
          </div>
        )}
        <div>
          <CardTitle className="text-lg">
            {selectedThread.name ||
              getOtherParticipant(selectedThread)?.name ||
              getOtherParticipant(selectedThread)?.username ||
              'Unknown'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {selectedThread.is_group
              ? `${selectedThread.participants?.length || 0} members`
              : 'Producer • Online now'}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {selectedThread.is_group && (
            <DropdownMenuItem onClick={handleEditChatName}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Chat Name
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReportChat}>
            <Flag className="w-4 h-4 mr-2" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </CardHeader>
);

export default ChatHeader;
