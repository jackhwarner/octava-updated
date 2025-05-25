
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Music, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadFilesStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const UploadFilesStep = ({ data, onUpdate, onNext, onBack }: UploadFilesStepProps) => {
  const profilePicRef = useRef<HTMLInputElement>(null);
  const musicFilesRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Profile picture must be under 5MB"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)"
        });
        return;
      }
      
      onUpdate({ profilePic: file });
    }
  };

  const handleMusicFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      // Check file size (50MB limit per file)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} is too large. Music files must be under 50MB each.`
        });
        return false;
      }
      
      // Check file type
      if (!file.type.startsWith('audio/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an audio file. Please upload MP3, WAV, or other audio formats.`
        });
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      onUpdate({ musicFiles: [...data.musicFiles, ...validFiles] });
    }
  };

  const removeMusicFile = (index: number) => {
    const newFiles = data.musicFiles.filter((_: any, i: number) => i !== index);
    onUpdate({ musicFiles: newFiles });
  };

  const removeProfilePic = () => {
    onUpdate({ profilePic: null });
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Upload */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">Profile Picture</Label>
        <p className="text-sm text-gray-600">Upload a photo that represents you</p>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            {data.profilePic ? (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={URL.createObjectURL(data.profilePic)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0"
                  onClick={removeProfilePic}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div>
            <Button
              variant="outline"
              onClick={() => profilePicRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {data.profilePic ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        <input
          type="file"
          ref={profilePicRef}
          onChange={handleProfilePicUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Music Files Upload */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">Music Files (Optional)</Label>
        <p className="text-sm text-gray-600">Share some of your work to showcase your style</p>
        
        {data.musicFiles.length > 0 && (
          <div className="space-y-2">
            {data.musicFiles.map((file: File, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMusicFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => musicFilesRef.current?.click()}
          className="w-full h-24 border-dashed"
        >
          <div className="text-center">
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Click to upload music files</p>
            <p className="text-xs text-gray-500">MP3, WAV up to 50MB each</p>
          </div>
        </Button>

        <input
          type="file"
          ref={musicFilesRef}
          onChange={handleMusicFilesUpload}
          accept="audio/*"
          multiple
          className="hidden"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default UploadFilesStep;
