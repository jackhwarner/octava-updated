
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SessionDetailsDialogProps {
  session: {
    id: number;
    title: string;
    time: string;
    location: string;
    attendees: string[];
    description: string;
    type: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (sessionId: number) => void;
}

const SessionDetailsDialog = ({ session, open, onOpenChange, onDelete }: SessionDetailsDialogProps) => {
  if (!session) return null;

  const handleDelete = () => {
    onDelete(session.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {session.title}
            <Badge variant="outline" className="ml-2">
              {session.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{session.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{session.location}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Attendees ({session.attendees.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.attendees.map((attendee, index) => (
                <Badge key={index} variant="secondary">
                  {attendee}
                </Badge>
              ))}
            </div>
          </div>
          
          {session.description && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-600 text-sm">{session.description}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Session
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Session</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{session.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsDialog;
