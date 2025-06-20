import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Play, Pause, Upload, Plus, Trash2, Clock, Volume2 } from 'lucide-react';
import { useMusic, MusicTrack } from '../../hooks/useMusic';
import { useProfile } from '../../hooks/useProfile';
import React from 'react';
interface MusicTabProps {
  userId?: string;
  isOwnProfile?: boolean;
}
export const MusicTab = ({
  userId,
  isOwnProfile = true
}: MusicTabProps) => {
  const {
    tracks,
    loading,
    uploading,
    uploadTrack,
    deleteTrack,
    incrementPlayCount
  } = useMusic();
  const {
    profile
  } = useProfile();
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handlePlayPause = async (track: MusicTrack) => {
    if (isPlaying === track.id) {
      audioRef.current?.pause();
      setIsPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.file_url);
      audioRef.current = audio;
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(null);
        setCurrentTime(0);
      });
      try {
        await audio.play();
        setIsPlaying(track.id);
        if ((isOwnProfile ? profile?.id : userId) !== track.user_id) {
          incrementPlayCount(track.id, track.user_id);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };
  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const progressBar = progressBarRef.current;
    if (!progressBar) return;
    const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
    const percent = clickPosition / progressBar.offsetWidth;
    const seekTime = duration * percent;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };
  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) return;
    try {
      await uploadTrack(selectedFile, uploadTitle.trim());
      setShowUploadDialog(false);
      setSelectedFile(null);
      setUploadTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error handled in hook
    }
  };
  if (loading) {
    return <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>;
  }
  return <>
      <Card>
        <CardHeader className="pt-4 pb-0">
          <CardTitle className="flex items-center justify-between font-semibold text-2xl">
            My Tracks
            {isOwnProfile && <Button onClick={() => setShowUploadDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Upload Track
              </Button>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {tracks.length > 0 ? tracks.map(track => <div key={track.id} className="flex items-center justify-between p-5 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4 flex-1">
                  <Button variant="ghost" size="sm" onClick={() => handlePlayPause(track)} className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200">
                    {isPlaying === track.id ? <Pause className="w-5 h-5 text-purple-600" /> : <Play className="w-5 h-5 text-purple-600" />}
                  </Button>
                  <div className="flex-1">
                    <h4 className="font-medium text-base">{track.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(track.duration)}</span>
                      <span>•</span>
                      <Volume2 className="w-4 h-4" />
                      <span>{track.play_count} plays</span>
                    </div>
                    {isPlaying === track.id && <div className="mt-2">
                      <div ref={progressBarRef} className="w-full bg-gray-200 rounded-full h-1 cursor-pointer" onClick={handleSeek}>
                        <div className="bg-purple-600 h-1 rounded-full transition-all duration-100" style={{
                      width: `${currentTime / duration * 100}%`
                    }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatDuration(currentTime)}</span>
                        <span>{formatDuration(duration)}</span>
                      </div>
                    </div>}
                  </div>
                </div>
                {isOwnProfile && <Button variant="ghost" size="sm" onClick={() => deleteTrack(track.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>}
              </div>) : <div className="text-center py-8">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No tracks uploaded yet</p>
                {isOwnProfile}
              </div>}
          </div>
        </CardContent>
      </Card>

      {isOwnProfile && <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Track</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="audio-file">Audio File</Label>
                <Input ref={fileInputRef} id="audio-file" type="file" accept="audio/*" onChange={handleFileSelect} />
              </div>
              <div>
                <Label htmlFor="track-title">Track Title</Label>
                <Input id="track-title" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Enter track title" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || !uploadTitle.trim() || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>}
    </>;
};