
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, ExternalLink, Plus } from 'lucide-react';

export const MusicTab = () => {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const tracks = [
    { id: 1, title: 'Summer Nights', duration: '3:42', plays: 1250 },
    { id: 2, title: 'Midnight Drive', duration: '4:15', plays: 892 },
    { id: 3, title: 'City Lights', duration: '3:28', plays: 2104 },
  ];

  const handlePlayPause = (trackId: number) => {
    setIsPlaying(isPlaying === trackId ? null : trackId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tracks</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-5 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayPause(track.id)}
                  className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200"
                >
                  {isPlaying === track.id ? (
                    <Pause className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Play className="w-4 h-4 text-purple-600" />
                  )}
                </Button>
                <div>
                  <h4 className="font-medium">{track.title}</h4>
                  <p className="text-sm text-gray-500">{track.duration} • {track.plays} plays</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Upload Track
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
