
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAvailability } from '@/hooks/useAvailability';
import { useSessions } from '@/hooks/useSessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [availabilityType, setAvailabilityType] = useState("Available to collaborate");
  const [timeSelection, setTimeSelection] = useState("morning");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [isRecurring, setIsRecurring] = useState(true);
  
  const { availabilities, loading: availabilityLoading, addAvailability, deleteAvailability } = useAvailability();
  const { sessions, loading: sessionsLoading, deleteSession } = useSessions();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddAvailability = async () => {
    if (!isRecurring && selectedDayOfWeek === undefined) {
      toast({
        title: "Error",
        description: "Please select a day of the week",
        variant: "destructive",
      });
      return;
    }

    let startTime: string | undefined = undefined;
    let endTime: string | undefined = undefined;

    if (timeSelection === "custom") {
      if (!customStartTime || !customEndTime) {
        toast({
          title: "Error",
          description: "Please set both start and end times",
          variant: "destructive",
        });
        return;
      }
      startTime = customStartTime;
      endTime = customEndTime;
    }

    try {
      await addAvailability({
        availability_type: availabilityType,
        day_of_week: selectedDayOfWeek,
        period: timeSelection as 'morning' | 'afternoon' | 'evening' | 'custom',
        start_time: startTime,
        end_time: endTime,
        is_active: true
      });
      
      setShowAddAvailabilityDialog(false);
      setSelectedDayOfWeek(0);
      setCustomStartTime("");
      setCustomEndTime("");
      setTimeSelection("morning");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const formatTimeRange = (startTime: string | null, endTime: string | null, period: string) => {
    if (startTime && endTime) {
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };
      
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }

    // Fallback to period names
    switch (period) {
      case 'morning':
        return '9:00 AM - 12:00 PM';
      case 'afternoon':
        return '12:00 PM - 5:00 PM';
      case 'evening':
        return '5:00 PM - 10:00 PM';
      default:
        return 'Custom time';
    }
  };

  const formatSessionTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startStr = start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const endStr = end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${startStr} - ${endStr}`;
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar Card */}
        <Card className="flex-grow lg:w-3/5">
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
            <CardDescription>Manage your recurring availability</CardDescription>
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
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Weekly Availability</h3>
                <Button 
                  onClick={() => setShowAddAvailabilityDialog(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Availability
                </Button>
              </div>
              <div>
                {availabilityLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <>
                    {availabilities.map(availability => (
                      <div key={availability.id} className="p-3 border rounded-md flex justify-between items-center mb-3">
                        <div>
                          <div className="font-medium">
                            {getDayName(availability.day_of_week)} - {formatTimeRange(availability.start_time, availability.end_time, availability.period)}
                          </div>
                          <div className="text-sm text-gray-500">{availability.availability_type}</div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAvailability(availability.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {availabilities.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No availability set yet
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar with Sessions */}
        <div className="lg:w-2/5">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Availability</CardTitle>
              <CardDescription>Weekly recurring availability</CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {availabilities.slice(0, 5).map(availability => (
                    <div key={availability.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {getDayName(availability.day_of_week)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTimeRange(availability.start_time, availability.end_time, availability.period)}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {availability.availability_type}
                      </Badge>
                    </div>
                  ))}
                  {availabilities.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No availability set yet
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Scheduled sessions with collaborators</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map(session => (
                    <div key={session.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{session.title}</div>
                          <div className="text-sm text-gray-500">Type: {session.type}</div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-purple-600">
                            {formatSessionTime(session.start_time, session.end_time)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSession(session.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div>
                          {new Date(session.start_time).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        {session.location && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" /> {session.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No upcoming sessions
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Availability Dialog */}
      <Dialog open={showAddAvailabilityDialog} onOpenChange={setShowAddAvailabilityDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Weekly Availability</DialogTitle>
            <DialogDescription>
              Set your recurring weekly availability for collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="availability-type">Availability Type</Label>
              <Input
                id="availability-type"
                placeholder="e.g. Available to record, Available for mixing"
                value={availabilityType}
                onChange={(e) => setAvailabilityType(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select value={selectedDayOfWeek.toString()} onValueChange={(value) => setSelectedDayOfWeek(parseInt(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time Period</Label>
                <Select value={timeSelection} onValueChange={setTimeSelection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 10PM)</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {timeSelection === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="w-full" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    className="w-full" 
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAvailabilityDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddAvailability}>
              Save Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
