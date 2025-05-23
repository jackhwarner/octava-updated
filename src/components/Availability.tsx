
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarPlus, MapPin, Clock } from "lucide-react";

const Availability = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7))
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [location, setLocation] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const upcomingAvailability = [
    {
      id: 1,
      date: "May 24, 2025",
      time: "10:00 AM - 4:00 PM",
      type: "Studio",
      location: "Melody Studios, Los Angeles"
    },
    {
      id: 2,
      date: "May 26, 2025",
      time: "1:00 PM - 5:00 PM",
      type: "Remote",
      location: "Online"
    },
    {
      id: 3,
      date: "May 29, 2025",
      time: "6:00 PM - 9:00 PM",
      type: "Meetup",
      location: "Harmony Cafe, Downtown"
    }
  ];

  const getAvailabilityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'studio':
        return 'bg-purple-100 text-purple-800';
      case 'remote':
        return 'bg-blue-100 text-blue-800';
      case 'meetup':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
        <p className="text-gray-600">Manage when and where you're available to collaborate</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Schedule</CardTitle>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowAddDialog(true)}
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Add Availability
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-full max-w-full"
                numberOfMonths={2}
              />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Availability */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Availability</CardTitle>
              <CardDescription>When you're available for collaboration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAvailability.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{item.date}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(item.type)}`}>
                        {item.type}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                  </div>
                ))}
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
              Let others know when you're available for collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-from" className="text-right">
                Date Range
              </Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <Input 
                  id="date-from" 
                  type="date"
                  placeholder="From"
                />
                <Input 
                  id="date-to" 
                  type="date"
                  placeholder="To"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-from" className="text-right">
                Time
              </Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <Input 
                  id="time-from" 
                  type="time"
                  placeholder="From"
                />
                <Input 
                  id="time-to" 
                  type="time"
                  placeholder="To"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability-type" className="text-right">
                Type
              </Label>
              <Select value={availabilityType} onValueChange={setAvailabilityType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Availability type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="col-span-3" 
                placeholder="Where you'll be available"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right col-span-1">
                <Label htmlFor="repeat-weekly">Repeat</Label>
              </div>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="repeat-weekly" 
                  checked={repeatWeekly}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") setRepeatWeekly(checked);
                  }}
                />
                <Label htmlFor="repeat-weekly">Repeat weekly</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddDialog(false)}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
