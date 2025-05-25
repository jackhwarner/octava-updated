
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAvailability } from '@/hooks/useAvailability';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WeeklyAvailabilityCard() {
  const { availabilities, loading } = useAvailability();

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
    <Card>
      <CardHeader>
        <CardTitle>Your Weekly Availability</CardTitle>
        <CardDescription>Your recurring weekly schedule</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            {availabilities.slice(0, 7).map(availability => (
              <div key={availability.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {dayNames[availability.day_of_week]}
                  </div>
                  <div className="text-sm text-gray-500">
                    {availability.start_time && availability.end_time 
                      ? formatTimeRange(availability.start_time, availability.end_time)
                      : availability.period.charAt(0).toUpperCase() + availability.period.slice(1)
                    }
                  </div>
                </div>
                <Badge className={getAvailabilityTypeColor(availability.availability_type)}>
                  {availability.availability_type}
                </Badge>
              </div>
            ))}
            {availabilities.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No weekly availability set yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
