
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface GroupAvatarProps {
  participants: Array<{
    name: string;
    username: string;
  }>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GroupAvatar = ({ participants, size = 'md', className = '' }: GroupAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const innerSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayParticipants = participants.slice(0, 4); // Show max 4 participants

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main container circle */}
      <div className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center relative overflow-hidden`}>
        {/* Individual participant circles */}
        {displayParticipants.map((participant, index) => {
          const positions = [
            'absolute top-0.5 left-0.5', // top-left
            'absolute top-0.5 right-0.5', // top-right
            'absolute bottom-0.5 left-0.5', // bottom-left
            'absolute bottom-0.5 right-0.5', // bottom-right
          ];

          return (
            <Avatar key={participant.username} className={`${innerSizeClasses[size]} ${positions[index] || ''} border border-white`}>
              <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                {getInitials(participant.name)}
              </AvatarFallback>
            </Avatar>
          );
        })}
        
        {/* Show count if more than 4 participants */}
        {participants.length > 4 && (
          <div className="absolute inset-0 bg-gray-400/80 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">+{participants.length - 3}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupAvatar;
