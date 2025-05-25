
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import SessionCreationDialog from '@/components/SessionCreationDialog';
import SessionDetailsDialog from '@/components/SessionDetailsDialog';

interface SessionsCardProps {
  onSessionUpdate: () => void;
}

export default function SessionsCard({ onSessionUpdate }: SessionsCardProps) {
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [showSessionDetailsDialog, setShowSessionDetailsDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const { sessions, loading } = useSessions();

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setShowSessionDetailsDialog(true);
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

  return (
    <>
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
          {loading ? (
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

      <SessionCreationDialog
        open={showCreateSessionDialog}
        onOpenChange={setShowCreateSessionDialog}
        onSessionCreated={onSessionUpdate}
      />

      <SessionDetailsDialog
        session={selectedSession}
        open={showSessionDetailsDialog}
        onOpenChange={setShowSessionDetailsDialog}
        onSessionUpdated={onSessionUpdate}
        onSessionDeleted={() => {
          onSessionUpdate();
          setSelectedSession(null);
        }}
      />
    </>
  );
}
