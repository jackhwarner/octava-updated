
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const TodaySchedule = () => {
  const scheduleItems = [
    {
      id: 1,
      title: 'Recording Session',
      time: '2:00 PM - 4:00 PM',
    },
    {
      id: 2,
      title: 'Team Meeting',
      time: '5:00 PM - 6:00 PM',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduleItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
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
  );
};

export default TodaySchedule;
