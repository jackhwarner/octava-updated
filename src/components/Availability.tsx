
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("schedule");
  
  const availabilities = [
    {
      id: 1,
      date: "May 24, 2025",
      timeSlot: "10:00 AM - 2:00 PM",
      location: "Home Studio",
      type: "Recording",
    },
    {
      id: 2,
      date: "May 25, 2025",
      timeSlot: "3:00 PM - 7:00 PM",
      location: "Downtown Music Center",
      type: "Collaboration",
    },
    {
      id: 3,
      date: "May 27, 2025",
      timeSlot: "1:00 PM - 4:00 PM",
      location: "Remote",
      type: "Mixing",
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "Vocal Recording",
      with: "Sarah Johnson",
      date: "May 24, 2025",
      time: "11:00 AM - 1:00 PM",
      location: "Sarah's Studio",
    },
    {
      id: 2,
      title: "Production Meeting",
      with: "Marcus Williams",
      date: "May 26, 2025",
      time: "2:00 PM - 3:30 PM",
      location: "Virtual",
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
        <p className="text-gray-600">Manage your schedule and set your available times</p>
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
                    onClick={() => setShowAddAvailabilityDialog(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Availability
                  </Button>
                </div>
                <div>
                  {availabilities.some(a => a.date === "May 24, 2025") ? (
                    <div className="space-y-3">
                      {availabilities
                        .filter(a => a.date === "May 24, 2025")
                        .map(availability => (
                          <div key={availability.id} className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                              <div className="font-medium">{availability.timeSlot}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {availability.location}
                              </div>
                            </div>
                            <Badge variant="outline">{availability.type}</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No availability set for this day
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar with Sessions */}
        <div className="lg:w-2/5">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upcoming Availability</CardTitle>
              <CardDescription>Times you've marked as available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availabilities.map(availability => (
                  <div key={availability.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{availability.date}</div>
                      <div className="text-sm text-gray-500">{availability.timeSlot}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {availability.location}
                      </div>
                    </div>
                    <Badge variant="outline">{availability.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Scheduled sessions with collaborators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{session.title}</div>
                        <div className="text-sm">with {session.with}</div>
                      </div>
                      <Badge className="bg-purple-600">{session.time}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div>{session.date}</div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {session.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              Let others know when you're available for collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="onetime" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="onetime">One-time</TabsTrigger>
                <TabsTrigger value="recurring">Recurring</TabsTrigger>
              </TabsList>
              <TabsContent value="onetime" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      className="w-full" 
                      defaultValue={date?.toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select defaultValue="morning">
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
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select defaultValue="studio">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Home Studio</SelectItem>
                      <SelectItem value="downtown">Downtown Music Center</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="custom">Custom Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Availability Type</Label>
                  <Select defaultValue="recording">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recording">Recording</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="mixing">Mixing</SelectItem>
                      <SelectItem value="mastering">Mastering</SelectItem>
                      <SelectItem value="writing">Songwriting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Add any additional details"
                    className="w-full"
                  />
                </div>
              </TabsContent>
              <TabsContent value="recurring" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="days">Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <Button 
                        key={day}
                        variant="outline" 
                        className="flex-1"
                        type="button"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input id="start-time" type="time" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" className="w-full" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repeat-until">Repeat Until</Label>
                  <Input id="repeat-until" type="date" className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rec-location">Location</Label>
                  <Select defaultValue="studio">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Home Studio</SelectItem>
                      <SelectItem value="downtown">Downtown Music Center</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="custom">Custom Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAvailabilityDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddAvailabilityDialog(false)}>
              Save Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
