
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { UserCheck, UserX } from 'lucide-react'

interface RequestRowProps {
  request: any
  isIncoming: boolean
  isLast: boolean
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onCancel?: (id: string) => void
  getInitials: (name: string) => string
}

const RequestRow = ({
  request,
  isIncoming,
  isLast,
  onAccept,
  onDecline,
  onCancel,
  getInitials
}: RequestRowProps) => (
  <div
    key={request.id}
    className={`flex items-center justify-between px-2 sm:px-4 py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}
  >
    <div className="flex items-center gap-4">
      <Avatar className="w-12 h-12 bg-gray-100">
        <AvatarImage src={request.avatar_url} />
        <AvatarFallback className="bg-purple-100 text-purple-700">
          {getInitials(request.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-gray-900">{request.name}</div>
        <div className="text-sm text-gray-600">@{request.username}</div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-400">{request.role}</span>
          {request.location && (
            <>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-400">{request.location}</span>
            </>
          )}
        </div>
        {request.message && (
          <p className="text-xs text-gray-500 mt-1 italic">"{request.message}"</p>
        )}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-start sm:items-center ml-4">
      {isIncoming ? (
        <>
          <Button
            variant="default"
            size="sm"
            onClick={() => onAccept && onAccept(request.id)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <UserCheck className="w-4 h-4 mr-1" />
            Accept
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDecline && onDecline(request.id)}
            className="text-red-600 hover:text-red-700"
          >
            <UserX className="w-4 h-4 mr-1" />
            Decline
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel && onCancel(request.id)}
          className="text-red-600 hover:text-red-700"
        >
          <UserX className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      )}
    </div>
  </div>
);

export default RequestRow;
