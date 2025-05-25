
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useAvailability, Availability } from '@/hooks/useAvailability';
import { AvailabilityListItem } from './AvailabilityListItem';

interface AvailabilityCardProps {
  onAddAvailability: (dayOfWeek: number) => void;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityCard({ onAddAvailability }: AvailabilityCardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { availabilities, loading, deleteAvailability } = useAvailability();

  const getAvailabilitiesForDay = (dayOfWeek: number) => {
    return availabilities.filter(a => a.day_of_week === dayOfWeek);
  };

  const getCurrentDayOfWeek = () => {
    return date ? date.getDay() : new Date().getDay();
  };

  return (
    <Card className="flex-grow lg:w-3/5">
      <CardHeader>
        <CardTitle>Your Weekly Schedule</CardTitle>
        <CardDescription>Set your weekly availability patterns</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full max-w-xl rounded-md border shadow-sm p-3 pointer-events-auto"
          numberOfMonths={window.innerWidth < 768 ? 1 : 2}
        />
      </CardContent>
      <CardContent className="pt-0">
        {date && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {dayNames[getCurrentDayOfWeek()]} - Recurring Weekly
              </h3>
              <Button 
                onClick={() => onAddAvailability(getCurrentDayOfWeek())}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Weekly Availability
              </Button>
            </div>
            <div>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <>
                  {getAvailabilitiesForDay(getCurrentDayOfWeek()).map(availability => (
                    <AvailabilityListItem
                      key={availability.id}
                      availability={availability}
                      onDelete={deleteAvailability}
                    />
                  ))}
                  {getAvailabilitiesForDay(getCurrentDayOfWeek()).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No weekly availability set for {dayNames[getCurrentDayOfWeek()]}s
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
