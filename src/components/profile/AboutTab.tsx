
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Profile } from '@/hooks/useProfile';
import { Availability } from '@/hooks/useAvailability';
import { useState, useEffect } from 'react';

interface AboutTabProps {
  profile: Profile | null;
  availabilities: Availability[];
}

export const AboutTab = ({ profile, availabilities }: AboutTabProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5-10 years)' },
    { value: 'professional', label: 'Professional (10+ years)' },
  ];

  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date();
    
    availabilities.forEach(availability => {
      if (availability.availability_type === 'weekly' && availability.day_of_week !== null) {
        // Add next occurrence of this day of week
        const nextDate = new Date(today);
        const dayDiff = (availability.day_of_week - today.getDay() + 7) % 7;
        nextDate.setDate(today.getDate() + dayDiff);
        dates.push(nextDate);
      } else if (availability.availability_type === 'date_range' && availability.start_date) {
        const startDate = new Date(availability.start_date);
        const endDate = availability.end_date ? new Date(availability.end_date) : startDate;
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      }
    });
    
    setSelectedDates(dates);
  }, [availabilities]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-gray-600">
              {profile?.bio || 'No bio available. Click "Edit Profile" to add one.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Experience Level</h3>
              <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-xs">
                {experienceLevels.find(level => level.value === profile?.experience)?.label || 'Not specified'}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {profile?.skills?.length ? profile.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-4 py-2 text-xs">
                    {skill}
                  </Badge>
                )) : (
                  <p className="text-gray-500 text-sm">No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <CalendarComponent 
            mode="multiple"
            selected={selectedDates}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    </div>
  );
};
