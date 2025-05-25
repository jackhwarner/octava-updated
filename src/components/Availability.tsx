
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAvailability } from '@/hooks/useAvailability';
import { useSessions } from '@/hooks/useSessions';
import AvailabilityCard from './availability/AvailabilityCard';
import SessionsCard from './availability/SessionsCard';
import WeeklyAvailabilityCard from './availability/WeeklyAvailabilityCard';
import AddAvailabilityDialog from './availability/AddAvailabilityDialog';

const Availability = () => {
  const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  
  const { refetch: refetchAvailability } = useAvailability();
  const { refetch: refetchSessions } = useSessions();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddAvailability = (dayOfWeek: number) => {
    setSelectedDayOfWeek(dayOfWeek);
    setShowAddAvailabilityDialog(true);
  };

  const handleSessionUpdate = () => {
    refetchSessions();
    refetchAvailability();
  };

  const handleAvailabilityAdded = () => {
    refetchAvailability();
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
        <AvailabilityCard onAddAvailability={handleAddAvailability} />

        <div className="lg:w-2/5">
          <SessionsCard onSessionUpdate={handleSessionUpdate} />
          <WeeklyAvailabilityCard />
        </div>
      </div>

      <AddAvailabilityDialog
        open={showAddAvailabilityDialog}
        onOpenChange={setShowAddAvailabilityDialog}
        selectedDayOfWeek={selectedDayOfWeek}
        onAvailabilityAdded={handleAvailabilityAdded}
      />
    </div>
  );
};

export default Availability;
