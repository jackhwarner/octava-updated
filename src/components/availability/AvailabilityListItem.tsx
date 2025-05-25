
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Availability } from '@/hooks/useAvailability';

interface AvailabilityListItemProps {
  availability: Availability;
  onDelete: (id: string) => void;
}

export function AvailabilityListItem({ availability, onDelete }: AvailabilityListItemProps) {
  const formatTimeRange = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const getAvailabilityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'available to record': return 'bg-green-100 text-green-800';
      case 'available for mixing': return 'bg-purple-100 text-purple-800';
      case 'available for collaboration': return 'bg-blue-100 text-blue-800';
      case 'practice time': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-3 border rounded-md flex justify-between items-center mb-3">
      <div>
        <div className="font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {availability.start_time && availability.end_time 
            ? formatTimeRange(availability.start_time, availability.end_time)
            : availability.period.charAt(0).toUpperCase() + availability.period.slice(1)
          }
        </div>
        <div className="text-sm text-gray-500 mt-1">{availability.availability_type}</div>
      </div>
      <div className="flex gap-2">
        <Badge className={getAvailabilityTypeColor(availability.availability_type)}>
          {availability.availability_type}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(availability.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
