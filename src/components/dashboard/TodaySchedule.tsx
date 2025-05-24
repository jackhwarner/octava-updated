
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import SessionDetailsDialog from './SessionDetailsDialog';

const TodaySchedule = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 1,
      title: 'Recording Session',
      time: '2:00 PM - 4:00 PM',
      location: 'Studio A, Downtown Music Center',
      attendees: ['Alex Rodriguez', 'Sarah Chen', 'Mike Johnson'],
      description: 'Recording vocals for the new track "Summer Nights". Please bring headphones and water.',
      type: 'Recording',
    },
    {
      id: 2,
      title: 'Team Meeting',
      time: '5:00 PM - 6:00 PM',
      location: 'Conference Room B, Creative Hub',
      attendees: ['Alex Rodriguez', 'Emily Davis', 'Tom Wilson', 'Lisa Park'],
      description: 'Weekly team sync to discuss upcoming projects and deadlines.',
      type: 'Meeting',
    },
  ]);

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setShowSessionDialog(true);
  };

  const handleDeleteSession = (sessionId: number) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== sessionId));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSessionClick(item)}
              >
                <Clock className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SessionDetailsDialog
        session={selectedSession}
        open={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        onDelete={handleDeleteSession}
      />
    </>
  );
};

export default TodaySchedule;
