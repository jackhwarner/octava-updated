import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Trash2, Archive, File, Image, Video, FileText, Play, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectFileListProps {
  files: any[];
  currentUser: any;
  projectSettings: any;
  onFileDeleted: (fileId: string) => void;
  onFileApproved: (fileId: string) => void;
  onVersionReverted: (versionId: string) => void;
}

const ProjectFileList = ({
  files,
  currentUser,
  projectSettings,
  onFileDeleted,
  onFileApproved,
  onVersionReverted,
}: ProjectFileListProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type?.startsWith('audio/')) return <Play className="w-4 h-4" />;
    if (type?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type?.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type?.includes('pdf') || type?.includes('text')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const getStatusIcon = (file: any) => {
    if (file.is_pending_approval) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    }
    if (file.approved_at) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return null;
  };

  const getStatusBadge = (file: any) => {
    if (file.is_pending_approval) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending Approval</Badge>;
    }
    if (file.approved_at) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
    }
    return null;
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);
      if (error) throw error;

      onFileDeleted(fileId);
      toast({
        title: "File deleted",
        description: "The file has been removed from the project.",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleApproveFile = async (fileId: string) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('project_files')
        .update({
          is_pending_approval: false,
          approved_at: new Date().toISOString(),
          approved_by: currentUser.id
        })
        .eq('id', fileId);

      if (error) throw error;

      onFileApproved(fileId);
      toast({
        title: "File approved",
        description: "The file has been approved and is now the current version.",
      });
    } catch (error) {
      console.error('Error approving file:', error);
      toast({
        title: "Error",
        description: "Failed to approve file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = async () => {
    toast({
      title: "Download All",
      description: "Zip download feature would be implemented here.",
    });
  };

  const isOwner = currentUser?.id === projectSettings?.owner_id;
  const pendingFiles = files.filter(file => file.is_pending_approval);
  const approvedFiles = files.filter(file => !file.is_pending_approval);

  return (
    <>
      {/* Pending Approvals */}
      {isOwner && pendingFiles.length > 0 && (
        <Card className="border-yellow-200 mb-6">
          <CardHeader>
            <CardTitle className="text-yellow-800">Pending Approvals ({pendingFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <div className="text-yellow-700">
                        {getFileIcon(file.file_type)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.file_name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <span>•</span>
                        <span>by {file.uploader?.name || 'Unknown'}</span>
                      </div>
                      {file.version_notes && (
                        <p className="text-sm text-gray-600 mt-1">{file.version_notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm"
                      onClick={() => handleApproveFile(file.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
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
          </CardContent>
        </Card>
      )}

      {/* Files List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Files ({approvedFiles.length})</CardTitle>
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            disabled={files.length === 0}
          >
            <Archive className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </CardHeader>
        <CardContent>
          {approvedFiles.length === 0 ? (
            <div className="text-center py-8">
              <File className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No approved files yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="text-purple-700">
                        {getFileIcon(file.file_type)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{file.file_name}</p>
                        {getStatusIcon(file)}
                        {getStatusBadge(file)}
                      </div>
                      {/* Inline file info: size, version, owner, date */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <span>•</span>
                        <span className="text-xs text-gray-500">{`v${file.version || 1}`}</span>
                        <span>•</span>
                        <span>by {file.uploader?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleDateString()}</span>
                      </div>
                      {file.version_notes && (
                        <p className="text-sm text-gray-600 mt-1">{file.version_notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <img src={previewImage} alt="Preview" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProjectFileList;
