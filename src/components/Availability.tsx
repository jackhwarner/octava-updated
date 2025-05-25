import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAvailability } from '@/hooks/useAvailability';
import { useSessions } from '@/hooks/useSessions';
import { useConflicts } from '@/hooks/useConflicts';
import CollaboratorSelector from './CollaboratorSelector';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({from: undefined, to: undefined});
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false);
  const [showAddConflictDialog, setShowAddConflictDialog] = useState(false);
  
  // Availability form state
  const [availabilityType, setAvailabilityType] = useState("Available to collaborate");
  const [timeSelection, setTimeSelection] = useState("morning");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [isRecurring, setIsRecurring] = useState(true);
  const [isDateRange, setIsDateRange] = useState(false);
  
  // Session form state
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionType, setSessionType] = useState("recording");
  const [sessionLocation, setSessionLocation] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [sessionEndTime, setSessionEndTime] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionCollaborators, setSessionCollaborators] = useState<any[]>([]);
  
  // Conflict form state
  const [conflictTitle, setConflictTitle] = useState("");
  const [conflictDescription, setConflictDescription] = useState("");
  const [conflictStartDate, setConflictStartDate] = useState("");
  const [conflictEndDate, setConflictEndDate] = useState("");
  const [conflictStartTime, setConflictStartTime] = useState("");
  const [conflictEndTime, setConflictEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  
  const { availabilities, loading: availabilityLoading, addAvailability, deleteAvailability } = useAvailability();
  const { sessions, loading: sessionsLoading, addSession, deleteSession } = useSessions();
  const { conflicts, loading: conflictsLoading, addConflict, deleteConflict } = useConflicts();

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
      const availabilityData: any = {
        availability_type: availabilityType,
        period: timeSelection as 'morning' | 'afternoon' | 'evening' | 'custom',
        start_time: startTime,
        end_time: endTime,
        is_active: true,
        is_recurring: isRecurring
      };

      if (isRecurring) {
        availabilityData.day_of_week = selectedDayOfWeek;
      } else {
        if (selectedDateRange.from) {
          availabilityData.start_date = selectedDateRange.from.toISOString().split('T')[0];
        }
        if (selectedDateRange.to) {
          availabilityData.end_date = selectedDateRange.to.toISOString().split('T')[0];
        }
      }

      await addAvailability(availabilityData);
      
      setShowAddAvailabilityDialog(false);
      setSelectedDayOfWeek(0);
      setCustomStartTime("");
      setCustomEndTime("");
      setTimeSelection("morning");
      setSelectedDateRange({from: undefined, to: undefined});
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

      await addSession({
        title: sessionTitle,
        description: sessionDescription,
        type: sessionType as any,
        location: sessionLocation,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        collaborators: sessionCollaborators
      });

      setShowAddSessionDialog(false);
      setSessionTitle("");
      setSessionDescription("");
      setSessionLocation("");
      setSessionDate("");
      setSessionStartTime("");
      setSessionEndTime("");
      setSessionCollaborators([]);
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const handleAddConflict = async () => {
    if (!conflictTitle || !conflictStartDate) {
      return;
    }

    try {
      await addConflict({
        title: conflictTitle,
        description: conflictDescription,
        start_date: conflictStartDate,
        end_date: conflictEndDate || undefined,
        start_time: isAllDay ? undefined : conflictStartTime,
        end_time: isAllDay ? undefined : conflictEndTime,
        is_all_day: isAllDay
      });

      setShowAddConflictDialog(false);
      setConflictTitle("");
      setConflictDescription("");
      setConflictStartDate("");
      setConflictEndDate("");
      setConflictStartTime("");
      setConflictEndTime("");
      setIsAllDay(false);
    } catch (error) {
      console.error('Error adding conflict:', error);
    }
  };

  // Calendar styling function
  const getDateModifiers = () => {
    const modifiers: any = {};
    const modifiersClassNames: any = {};
    
    // Today - purple outline
    modifiers.today = new Date();
    modifiersClassNames.today = "border-2 border-purple-600 bg-transparent";
    
    // Available days - light purple background
    const availableDates: Date[] = [];
    availabilities.forEach(availability => {
      if (availability.is_recurring && availability.day_of_week !== null) {
        // For recurring availability, mark all future dates with that day of week
        const today = new Date();
        for (let i = 0; i < 90; i++) { // Next 90 days
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() + i);
          if (checkDate.getDay() === availability.day_of_week) {
            availableDates.push(new Date(checkDate));
          }
        }
      } else if (availability.start_date) {
        // For specific date availability
        const startDate = new Date(availability.start_date);
        const endDate = availability.end_date ? new Date(availability.end_date) : startDate;
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          availableDates.push(new Date(d));
        }
      }
    });
    
    if (availableDates.length > 0) {
      modifiers.available = availableDates;
      modifiersClassNames.available = "bg-purple-100 text-purple-900";
    }
    
    // Session days - blue background
    const sessionDates = sessions.map(session => new Date(session.start_time.split('T')[0]));
    if (sessionDates.length > 0) {
      modifiers.session = sessionDates;
      modifiersClassNames.session = "bg-blue-500 text-white hover:bg-blue-600";
    }
    
    // Conflict days - light red background
    const conflictDates: Date[] = [];
    conflicts.forEach(conflict => {
      const startDate = new Date(conflict.start_date);
      const endDate = conflict.end_date ? new Date(conflict.end_date) : startDate;
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        conflictDates.push(new Date(d));
      }
    });
    
    if (conflictDates.length > 0) {
      modifiers.conflict = conflictDates;
      modifiersClassNames.conflict = "bg-red-200 text-red-900";
    }
    
    return { modifiers, modifiersClassNames };
  };

  const { modifiers, modifiersClassNames } = getDateModifiers();

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
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="w-full max-w-xl rounded-md border shadow-sm p-3 pointer-events-auto"
              numberOfMonths={window.innerWidth < 768 ? 1 : 2}
            />
          </CardContent>
          <CardContent className="pt-0">
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Weekly Availability</h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowAddAvailabilityDialog(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Availability
                  </Button>
                  <Button 
                    onClick={() => setShowAddConflictDialog(true)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" /> Add Conflict
                  </Button>
                </div>
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
                            {availability.is_recurring && availability.day_of_week !== null ? 
                              `${getDayName(availability.day_of_week)} - ${formatTimeRange(availability.start_time, availability.end_time, availability.period)}` :
                              `${availability.start_date}${availability.end_date ? ` to ${availability.end_date}` : ''} - ${formatTimeRange(availability.start_time, availability.end_time, availability.period)}`
                            }
                          </div>
                          <div className="text-sm text-gray-500">{availability.availability_type}</div>
                          <div className="text-xs text-gray-400">
                            {availability.is_recurring ? 'Recurring' : 'Specific dates'}
                          </div>
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
              
              {/* Conflicts Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Conflicts & Unavailable Times</h3>
                <div>
                  {conflictsLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <>
                      {conflicts.map(conflict => (
                        <div key={conflict.id} className="p-3 border rounded-md flex justify-between items-center mb-3 border-red-200">
                          <div>
                            <div className="font-medium">{conflict.title}</div>
                            <div className="text-sm text-gray-500">
                              {conflict.start_date}{conflict.end_date ? ` to ${conflict.end_date}` : ''}
                              {!conflict.is_all_day && conflict.start_time && conflict.end_time && 
                                ` • ${formatTimeRange(conflict.start_time, conflict.end_time, 'custom')}`
                              }
                            </div>
                            {conflict.description && (
                              <div className="text-xs text-gray-400">{conflict.description}</div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge className="bg-red-100 text-red-800">
                              Unavailable
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteConflict(conflict.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                      {conflicts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No conflicts recorded
                        </div>
                      )}
                    </>
                  )}
                </div>
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
                            {session.attendees && session.attendees.length > 0 && (
                              <div className="text-xs text-gray-400">
                                Collaborators: {session.attendees.map(a => a.profiles.name).join(', ')}
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
                          {availability.is_recurring && availability.day_of_week !== null ? 
                            getDayName(availability.day_of_week) :
                            `${availability.start_date}${availability.end_date ? ` - ${availability.end_date}` : ''}`
                          }
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
              <Label>Schedule Type</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recurring" 
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked === true)}
                />
                <Label htmlFor="recurring">Recurring weekly availability</Label>
              </div>
            </div>

            {isRecurring ? (
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
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={selectedDateRange.from?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setSelectedDateRange(prev => ({
                      ...prev,
                      from: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date (Optional)</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={selectedDateRange.to?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setSelectedDateRange(prev => ({
                      ...prev,
                      to: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
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
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
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
              <Label>Add Collaborators (Optional)</Label>
              <CollaboratorSelector
                selectedCollaborators={sessionCollaborators}
                onCollaboratorsChange={setSessionCollaborators}
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

      {/* Add Conflict Dialog */}
      <Dialog open={showAddConflictDialog} onOpenChange={setShowAddConflictDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Conflict</DialogTitle>
            <DialogDescription>
              Mark times when you're unavailable.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="conflict-title">Conflict Title</Label>
              <Input
                id="conflict-title"
                placeholder="e.g. Vacation, Another commitment, Unavailable"
                value={conflictTitle}
                onChange={(e) => setConflictTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conflict-start-date">Start Date</Label>
                <Input
                  id="conflict-start-date"
                  type="date"
                  value={conflictStartDate}
                  onChange={(e) => setConflictStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conflict-end-date">End Date (Optional)</Label>
                <Input
                  id="conflict-end-date"
                  type="date"
                  value={conflictEndDate}
                  onChange={(e) => setConflictEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-day" 
                  checked={isAllDay}
                  onCheckedChange={(checked) => setIsAllDay(checked === true)}
                />
                <Label htmlFor="all-day">All day conflict</Label>
              </div>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conflict-start-time">Start Time</Label>
                  <Input
                    id="conflict-start-time"
                    type="time"
                    value={conflictStartTime}
                    onChange={(e) => setConflictStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conflict-end-time">End Time</Label>
                  <Input
                    id="conflict-end-time"
                    type="time"
                    value={conflictEndTime}
                    onChange={(e) => setConflictEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="conflict-description">Description (Optional)</Label>
              <Textarea
                id="conflict-description"
                placeholder="Additional details about the conflict..."
                value={conflictDescription}
                onChange={(e) => setConflictDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddConflictDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleAddConflict}>
              Add Conflict
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
