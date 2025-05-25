
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, LogOut, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAvailability } from '@/hooks/useAvailability';
import { useSessions } from '@/hooks/useSessions';
import SessionCreationDialog from './SessionCreationDialog';
import SessionDetailsDialog from './SessionDetailsDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [showSessionDetailsDialog, setShowSessionDetailsDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availabilityType, setAvailabilityType] = useState("Available to record");
  const [timeSelection, setTimeSelection] = useState("morning");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  
  const { availabilities, loading: availabilityLoading, addAvailability, deleteAvailability, refetch: refetchAvailability } = useAvailability();
  const { sessions, loading: sessionsLoading, deleteSession, refetch: refetchSessions } = useSessions();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setShowSessionDetailsDialog(true);
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddAvailability = async () => {
    let startTime = "";
    let endTime = "";

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
    } else {
      // Convert predefined time slots
      switch (timeSelection) {
        case "morning":
          startTime = "09:00";
          endTime = "12:00";
          break;
        case "afternoon":
          startTime = "12:00";
          endTime = "17:00";
          break;
        case "evening":
          startTime = "17:00";
          endTime = "22:00";
          break;
      }
    }

    try {
      await addAvailability({
        day_of_week: selectedDayOfWeek,
        period: timeSelection as 'morning' | 'afternoon' | 'evening' | 'custom',
        start_time: startTime,
        end_time: endTime,
        availability_type: availabilityType,
        is_active: true
      });
      
      setShowAddAvailabilityDialog(false);
      setSelectedDayOfWeek(0);
      setCustomStartTime("");
      setCustomEndTime("");
      setTimeSelection("morning");
      setAvailabilityType("Available to record");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

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

  const getAvailabilityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'available to record': return 'bg-green-100 text-green-800';
      case 'available for mixing': return 'bg-purple-100 text-purple-800';
      case 'available for collaboration': return 'bg-blue-100 text-blue-800';
      case 'practice time': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilitiesForDay = (dayOfWeek: number) => {
    return availabilities.filter(a => a.day_of_week === dayOfWeek);
  };

  const getCurrentDayOfWeek = () => {
    return date ? date.getDay() : new Date().getDay();
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
                    onClick={() => {
                      setSelectedDayOfWeek(getCurrentDayOfWeek());
                      setShowAddAvailabilityDialog(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Weekly Availability
                  </Button>
                </div>
                <div>
                  {availabilityLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <>
                      {getAvailabilitiesForDay(getCurrentDayOfWeek()).map(availability => (
                        <div key={availability.id} className="p-3 border rounded-md flex justify-between items-center mb-3">
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
                              onClick={() => deleteAvailability(availability.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
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

        {/* Sidebar with Sessions and Availability */}
        <div className="lg:w-2/5">
          {/* Upcoming Sessions */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Scheduled sessions with collaborators</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowCreateSessionDialog(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1" /> New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map(session => (
                    <div 
                      key={session.id} 
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{session.title}</div>
                          <div className="text-sm text-gray-500 capitalize">Type: {session.type}</div>
                        </div>
                        <Badge className="bg-purple-600">
                          {formatSessionTime(session.start_time, session.end_time)}
                        </Badge>
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

          {/* Your Weekly Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Your Weekly Availability</CardTitle>
              <CardDescription>Your recurring weekly schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
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
        </div>
      </div>

      {/* Add Availability Dialog */}
      <Dialog open={showAddAvailabilityDialog} onOpenChange={setShowAddAvailabilityDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Weekly Availability</DialogTitle>
            <DialogDescription>
              Set up your recurring weekly availability for collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="availability-type">What are you available for?</Label>
              <Select value={availabilityType} onValueChange={setAvailabilityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available to record">Available to record</SelectItem>
                  <SelectItem value="Available for mixing">Available for mixing</SelectItem>
                  <SelectItem value="Available for collaboration">Available for collaboration</SelectItem>
                  <SelectItem value="Practice time">Practice time</SelectItem>
                  <SelectItem value="Open for anything">Open for anything</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select value={selectedDayOfWeek.toString()} onValueChange={(value) => setSelectedDayOfWeek(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayNames.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                    ))}
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

      {/* Session Creation Dialog */}
      <SessionCreationDialog
        open={showCreateSessionDialog}
        onOpenChange={setShowCreateSessionDialog}
        onSessionCreated={() => {
          refetchSessions();
          refetchAvailability();
        }}
      />

      {/* Session Details Dialog */}
      <SessionDetailsDialog
        session={selectedSession}
        open={showSessionDetailsDialog}
        onOpenChange={setShowSessionDetailsDialog}
        onSessionUpdated={() => {
          refetchSessions();
          setSelectedSession(null);
        }}
        onSessionDeleted={(sessionId) => {
          refetchSessions();
          setSelectedSession(null);
        }}
      />
    </div>
  );
};

export default Availability;
