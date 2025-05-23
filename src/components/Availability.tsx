
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [location, setLocation] = useState('');
  const [availabilityType, setAvailabilityType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  const availabilityEntries = [
    {
      id: 1,
      date: new Date(2025, 4, 25),
      startTime: '10:00 AM',
      endTime: '4:00 PM',
      location: 'Home Studio, Los Angeles',
      type: 'Recording'
    },
    {
      id: 2,
      date: new Date(2025, 4, 27),
      startTime: '1:00 PM',
      endTime: '7:00 PM',
      location: 'Echo Chamber Studios, Los Angeles',
      type: 'Collaboration'
    },
    {
      id: 3,
      date: new Date(2025, 4, 30),
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      location: 'Online',
      type: 'Virtual Session'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
        <p className="text-gray-600">Manage your schedule and let others know when you're free to collaborate</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Your availability schedule</CardDescription>
                </div>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Availability
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow p-3 pointer-events-auto w-full"
              />

              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">
                  {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
                <div className="space-y-4">
                  {date && availabilityEntries
                    .filter(entry => 
                      entry.date.getDate() === date.getDate() &&
                      entry.date.getMonth() === date.getMonth() &&
                      entry.date.getFullYear() === date.getFullYear()
                    )
                    .map(entry => (
                      <div key={entry.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium">{entry.type}</div>
                          <div className="text-sm text-gray-600">{entry.startTime} - {entry.endTime}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {entry.location}
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  {date && availabilityEntries.filter(entry => 
                    entry.date.getDate() === date.getDate() &&
                    entry.date.getMonth() === date.getMonth() &&
                    entry.date.getFullYear() === date.getFullYear()
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No availability set for this date
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Location Settings</CardTitle>
              <CardDescription>Set your default working locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Location</Label>
                <div className="flex items-center gap-2">
                  <Input defaultValue="Los Angeles, CA" className="flex-1" />
                  <Button variant="outline" size="icon">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Locations</Label>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">Home Studio</div>
                      <div className="text-sm text-gray-500">Los Angeles, CA</div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">Echo Chamber Studios</div>
                      <div className="text-sm text-gray-500">Los Angeles, CA</div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">Virtual</div>
                      <div className="text-sm text-gray-500">Online</div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Availability Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Availability</DialogTitle>
            <DialogDescription>
              Set when and where you're available for collaboration
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avail-date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avail-start" className="text-right">
                Start Time
              </Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avail-end" className="text-right">
                End Time
              </Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avail-location" className="text-right">
                Location
              </Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-studio">Home Studio, Los Angeles</SelectItem>
                  <SelectItem value="echo">Echo Chamber Studios, Los Angeles</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="custom">Custom Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avail-type" className="text-right">
                Type
              </Label>
              <Select value={availabilityType} onValueChange={setAvailabilityType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recording">Recording</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="virtual">Virtual Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avail-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="avail-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                placeholder="Add any additional information"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddDialog(false)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
