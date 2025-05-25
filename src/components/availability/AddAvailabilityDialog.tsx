
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAvailability } from '@/hooks/useAvailability';

interface AddAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDayOfWeek: number;
  onAvailabilityAdded: () => void;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AddAvailabilityDialog({ 
  open, 
  onOpenChange, 
  selectedDayOfWeek, 
  onAvailabilityAdded 
}: AddAvailabilityDialogProps) {
  const [availabilityType, setAvailabilityType] = useState("Available to record");
  const [timeSelection, setTimeSelection] = useState("morning");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [currentSelectedDay, setCurrentSelectedDay] = useState(selectedDayOfWeek);
  
  const { addAvailability } = useAvailability();
  const { toast } = useToast();

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
        day_of_week: currentSelectedDay,
        period: timeSelection as 'morning' | 'afternoon' | 'evening' | 'custom',
        start_time: startTime,
        end_time: endTime,
        availability_type: availabilityType,
        is_active: true
      });
      
      onOpenChange(false);
      setCurrentSelectedDay(0);
      setCustomStartTime("");
      setCustomEndTime("");
      setTimeSelection("morning");
      setAvailabilityType("Available to record");
      onAvailabilityAdded();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <Select value={currentSelectedDay.toString()} onValueChange={(value) => setCurrentSelectedDay(parseInt(value))}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddAvailability}>
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
