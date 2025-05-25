import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useAvailability } from '@/hooks/useAvailability';
import { useSessions } from '@/hooks/useSessions';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false);
  const [availabilityType, setAvailabilityType] = useState("Available to collaborate");
  const [timeSelection, setTimeSelection] = useState("morning");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [isRecurring, setIsRecurring] = useState(true);
  
  // Session form state
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionType, setSessionType] = useState("recording");
  const [sessionLocation, setSessionLocation] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [sessionEndTime, setSessionEndTime] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  
  const { availabilities, loading: availabilityLoading, addAvailability, deleteAvailability } = useAvailability();
  const { sessions, loading: sessionsLoading, deleteSession } = useSessions();

  const handleAddAvailability = async () => {
    let startTime: string | undefined = undefined;
    let endTime: string | undefined = undefined;

    if (timeSelection === "custom") {
      if (!customStartTime || !customEndTime) {
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

  const handleAddSession = async () => {
    if (!sessionTitle || !sessionDate || !sessionStartTime || !sessionEndTime) {
      return;
    }

    try {
      const startDateTime = new Date(`${sessionDate}T${sessionStartTime}`);
      const endDateTime = new Date(`${sessionDate}T${sessionEndTime}`);

      // Add session logic here - you'll need to create a useSessions hook or API call
      console.log('Adding session:', {
        title: sessionTitle,
        description: sessionDescription,
        type: sessionType,
        location: sessionLocation,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      });

      setShowAddSessionDialog(false);
      setSessionTitle("");
      setSessionDescription("");
      setSessionLocation("");
      setSessionDate("");
      setSessionStartTime("");
      setSessionEndTime("");
    } catch (error) {
      console.error('Error adding session:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Availability & Sessions</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar Card */}
        <Card className="flex-grow lg:w-3/5">
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
            <CardDescription>Manage your availability and sessions</CardDescription>
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
              
              {/* Availability List */}
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
              
              {/* Sessions Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Upcoming Sessions</h3>
                  <Button 
                    onClick={() => setShowAddSessionDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" /> Add Session
                  </Button>
                </div>
                <div>
                  {sessionsLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <>
                      {sessions.map(session => (
                        <div key={session.id} className="p-3 border rounded-md flex justify-between items-center mb-3">
                          <div>
                            <div className="font-medium">{session.title}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(session.start_time).toLocaleDateString()} - {formatSessionTime(session.start_time, session.end_time)}
                            </div>
                            {session.location && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {session.location}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {session.type}
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
                      ))}
                      {sessions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No upcoming sessions
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="lg:w-2/5">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Overview</CardTitle>
              <CardDescription>Your availability summary</CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {availabilities.slice(0, 3).map(availability => (
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
                        Available
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
        </div>
      </div>

      {/* Add Availability Dialog */}
      <Dialog open={showAddAvailabilityDialog} onOpenChange={setShowAddAvailabilityDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Availability</DialogTitle>
            <DialogDescription>
              Set your availability for collaboration.
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

            <div className="space-y-3">
              <Label>Recurring</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recurring" 
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked === true)}
                />
                <Label htmlFor="recurring">Make this a recurring weekly availability</Label>
              </div>
            </div>

            {isRecurring && (
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
            )}

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

      {/* Add Session Dialog */}
      <Dialog open={showAddSessionDialog} onOpenChange={setShowAddSessionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Session</DialogTitle>
            <DialogDescription>
              Create a new session for collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-title">Session Title</Label>
              <Input
                id="session-title"
                placeholder="Recording session, Mixing review, etc."
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-type">Session Type</Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recording">Recording</SelectItem>
                  <SelectItem value="mixing">Mixing</SelectItem>
                  <SelectItem value="mastering">Mastering</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="rehearsal">Rehearsal</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-date">Date</Label>
              <Input
                id="session-date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-start">Start Time</Label>
                <Input
                  id="session-start"
                  type="time"
                  value={sessionStartTime}
                  onChange={(e) => setSessionStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-end">End Time</Label>
                <Input
                  id="session-end"
                  type="time"
                  value={sessionEndTime}
                  onChange={(e) => setSessionEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-location">Location (Optional)</Label>
              <Input
                id="session-location"
                placeholder="Studio address, online meeting link, etc."
                value={sessionLocation}
                onChange={(e) => setSessionLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-description">Description (Optional)</Label>
              <Textarea
                id="session-description"
                placeholder="Additional details about the session..."
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSessionDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddSession}>
              Schedule Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
