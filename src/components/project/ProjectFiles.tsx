
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Trash2, Plus, Play, FileText, Image, Video, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectFilesProps {
  projectId: string;
}

const ProjectFiles = ({ projectId }: ProjectFilesProps) => {
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'demo-track.mp3',
      size: 5242880, // 5MB
      type: 'audio/mp3',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-20T10:30:00Z',
      url: '/lovable-uploads/sample-audio.mp3'
    },
    {
      id: '2',
      name: 'lyrics.txt',
      size: 2048, // 2KB
      type: 'text/plain',
      uploadedBy: 'Marcus Williams',
      uploadedAt: '2024-01-19T14:15:00Z',
      url: '/lovable-uploads/sample-text.txt'
    },
    {
      id: '3',
      name: 'album-cover.jpg',
      size: 1048576, // 1MB
      type: 'image/jpeg',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-18T09:45:00Z',
      url: '/lovable-uploads/473e0e70-6ce1-470c-989b-502bc6fc4f4e.png'
    },
    {
      id: '4',
      name: 'music-video.mp4',
      size: 15728640, // 15MB
      type: 'video/mp4',
      uploadedBy: 'Alex Rodriguez',
      uploadedAt: '2024-01-17T16:30:00Z',
      url: '/lovable-uploads/sample-video.mp4'
    }
  ]);
  
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string, isAudio = false) => {
    if (isAudio || type.startsWith('audio/')) {
      return <Play className="w-4 h-4" />;
    }
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('text')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);

    try {
      // Simulate file upload process
      for (const file of Array.from(selectedFiles)) {
        const newFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedBy: 'You',
          uploadedAt: new Date().toISOString(),
          url: URL.createObjectURL(file)
        };

        // Add to files list
        setFiles(prev => [newFile, ...prev]);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${selectedFiles.length} file(s) uploaded to the project.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been removed from the project.",
    });
  };

  const handleImagePreview = (file: any) => {
    if (file.type.startsWith('image/')) {
      setPreviewImage(file.url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Upload audio, video, images, documents, and more
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8">
              <File className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="text-purple-700">
                        {getFileIcon(file.type, file.type.startsWith('audio/'))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>Uploaded by {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.type.startsWith('image/') && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleImagePreview(file)}
                      >
                        <Image className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectFiles;
