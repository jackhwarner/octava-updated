
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [category, setCategory] = useState("open");
  const [title, setTitle] = useState("");
  const [timeSelection, setTimeSelection] = useState("morning");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  
  const { availabilities, loading: availabilityLoading, addAvailability, deleteAvailability, refetch: refetchAvailability } = useAvailability();
  const { sessions, loading: sessionsLoading, deleteSession, refetch: refetchSessions } = useSessions();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddAvailability = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

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
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        category: category,
        title: title || undefined,
        notes: notes || undefined
      });
      
      setShowAddAvailabilityDialog(false);
      setSelectedDate("");
      setTitle("");
      setCustomStartTime("");
      setCustomEndTime("");
      setNotes("");
      setTimeSelection("morning");
      setCategory("open");
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'recording': return 'bg-purple-100 text-purple-800';
      case 'relaxing': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <CardDescription>Select a date to see or set your availability</CardDescription>
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
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <Button 
                    onClick={() => {
                      setSelectedDate(date.toISOString().split('T')[0]);
                      setShowAddAvailabilityDialog(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Free Time
                  </Button>
                </div>
                <div>
                  {availabilityLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <>
                      {availabilities
                        .filter(a => a.date === date.toISOString().split('T')[0])
                        .map(availability => (
                          <div key={availability.id} className="p-3 border rounded-md flex justify-between items-center mb-3">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatTimeRange(availability.start_time, availability.end_time)}
                                {availability.title && <span className="text-sm text-gray-600">- {availability.title}</span>}
                              </div>
                              {availability.notes && (
                                <div className="text-sm text-gray-500 mt-1">{availability.notes}</div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getCategoryColor(availability.category)}>
                                {availability.category === 'open' ? 'Open' :
                                 availability.category === 'recording' ? 'Recording Available' :
                                 availability.category === 'relaxing' ? 'Relaxing' :
                                 availability.category === 'practice' ? 'Practice Time' :
                                 availability.category}
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
                      {availabilities.filter(a => a.date === date.toISOString().split('T')[0]).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No availability set for this day
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
                    <div key={session.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{session.title}</div>
                          <div className="text-sm text-gray-500 capitalize">Type: {session.type}</div>
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

          {/* Your Free Time */}
          <Card>
            <CardHeader>
              <CardTitle>Your Free Time</CardTitle>
              <CardDescription>When you're available for collaboration</CardDescription>
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
                          {new Date(availability.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          {availability.title && <span className="text-sm text-gray-600 ml-2">- {availability.title}</span>}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTimeRange(availability.start_time, availability.end_time)}
                        </div>
                      </div>
                      <Badge className={getCategoryColor(availability.category)}>
                        {availability.category === 'open' ? 'Open' :
                         availability.category === 'recording' ? 'Recording' :
                         availability.category === 'relaxing' ? 'Relaxing' :
                         availability.category === 'practice' ? 'Practice' :
                         availability.category}
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
            <DialogTitle>Add Free Time</DialogTitle>
            <DialogDescription>
              Let others know when you're free and available for collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open (General availability)</SelectItem>
                  <SelectItem value="recording">Recording Available</SelectItem>
                  <SelectItem value="relaxing">Relaxing Time</SelectItem>
                  <SelectItem value="practice">Practice Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Open for vocals', 'Chill session'"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="w-full" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes"
                placeholder="Any additional details"
                className="w-full"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
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
    </div>
  );
};

export default Availability;
