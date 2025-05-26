
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Download, Trash2, Plus, Play, FileText, Image, Video, File, Clock, CheckCircle, AlertCircle, History, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectFilesProps {
  projectId: string;
}

const ProjectFiles = ({ projectId }: ProjectFilesProps) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [versionNotes, setVersionNotes] = useState('');
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [fileVersions, setFileVersions] = useState([]);
  const [projectSettings, setProjectSettings] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
    fetchProjectSettings();
  }, [projectId]);

  const fetchProjectSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('version_approval_enabled, owner_id')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProjectSettings(data);
    } catch (error) {
      console.error('Error fetching project settings:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          *,
          profiles:uploaded_by (
            name,
            username
          ),
          approved_by_profile:approved_by (
            name,
            username
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load project files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFileVersions = async (fileName: string) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          *,
          profiles:uploaded_by (
            name,
            username
          )
        `)
        .eq('project_id', projectId)
        .eq('file_name', fileName)
        .order('version', { ascending: false });

      if (error) throw error;
      setFileVersions(data || []);
    } catch (error) {
      console.error('Error fetching file versions:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type?.startsWith('audio/')) {
      return <Play className="w-4 h-4" />;
    }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const isOwner = user.id === projectSettings?.owner_id;
      const needsApproval = projectSettings?.version_approval_enabled && !isOwner;

      for (const file of Array.from(selectedFiles)) {
        // Check if file already exists
        const existingFile = files.find(f => f.file_name === file.name);
        const version = existingFile ? (existingFile.version || 1) + 1 : 1;

        // Insert file record into database
        const { data, error } = await supabase
          .from('project_files')
          .insert([{
            project_id: projectId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            file_path: `projects/${projectId}/${file.name}`,
            uploaded_by: user.id,
            description: `File uploaded: ${file.name}`,
            version: version,
            is_pending_approval: needsApproval,
            approved_at: needsApproval ? null : new Date().toISOString(),
            approved_by: needsApproval ? null : user.id,
            parent_file_id: existingFile?.id || null,
            version_notes: versionNotes || null
          }])
          .select(`
            *,
            profiles:uploaded_by (
              name,
              username
            )
          `)
          .single();

        if (error) throw error;

        // Add to local state
        setFiles(prev => [data, ...prev]);

        // Create notification if approval is needed
        if (needsApproval) {
          await supabase
            .from('notifications')
            .insert([{
              user_id: projectSettings.owner_id,
              title: 'File Upload Requires Approval',
              message: `${data.profiles.name} uploaded "${file.name}" and requires your approval.`,
              type: 'file_approval',
              payload: { file_id: data.id, project_id: projectId }
            }]);
        }
      }

      toast({
        title: "Files uploaded successfully",
        description: needsApproval 
          ? "Files uploaded and pending approval from project owner."
          : `${selectedFiles.length} file(s) uploaded to the project.`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setVersionNotes('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApproveFile = async (fileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('project_files')
        .update({
          is_pending_approval: false,
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              is_pending_approval: false, 
              approved_at: new Date().toISOString(),
              approved_by: user.id
            }
          : file
      ));

      toast({
        title: "File approved",
        description: "The file has been approved and is now available.",
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

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prev => prev.filter(file => file.id !== fileId));
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

  const handleDownloadAll = async () => {
    // This would typically create a zip file on the server
    // For now, we'll show a placeholder message
    toast({
      title: "Download All",
      description: "Zip download feature would be implemented here.",
    });
  };

  const handleImagePreview = (file: any) => {
    if (file.file_type?.startsWith('image/')) {
      setPreviewImage(file.file_path);
    }
  };

  const openVersionHistory = (file: any) => {
    setSelectedFile(file);
    fetchFileVersions(file.file_name);
    setIsHistoryDialogOpen(true);
  };

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === projectSettings?.owner_id;
  const pendingFiles = files.filter(file => file.is_pending_approval);
  const approvedFiles = files.filter(file => !file.is_pending_approval);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upload Files</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              disabled={files.length === 0}
            >
              <Archive className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={uploading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Files</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="file-input">Select Files</Label>
                        <Input
                          id="file-input"
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          accept="audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="version-notes">Version Notes (optional)</Label>
                        <Textarea
                          id="version-notes"
                          value={versionNotes}
                          onChange={(e) => setVersionNotes(e.target.value)}
                          placeholder="Describe changes in this version..."
                          rows={3}
                        />
                      </div>
                      {projectSettings?.version_approval_enabled && !isOwner && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                              Files will require approval from the project owner before being published.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Upload audio, video, images, documents, and more
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      {isOwner && pendingFiles.length > 0 && (
        <Card className="border-yellow-200">
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
                        <span>v{file.version}</span>
                        <span>•</span>
                        <span>by {file.profiles?.name}</span>
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
        <CardHeader>
          <CardTitle>Project Files ({approvedFiles.length})</CardTitle>
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
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <span>•</span>
                        <span>v{file.version}</span>
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>by {file.profiles?.name}</span>
                      </div>
                      {file.version_notes && (
                        <p className="text-sm text-gray-600 mt-1">{file.version_notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openVersionHistory(file)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    {file.file_type?.startsWith('image/') && (
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

      {/* Version History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History - {selectedFile?.file_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {fileVersions.map((version) => (
              <div key={version.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">v{version.version}</span>
                    {version.version === selectedFile?.version && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(version.created_at).toLocaleString()} by {version.profiles?.name}
                  </p>
                  {version.version_notes && (
                    <p className="text-sm text-gray-500 mt-1">{version.version_notes}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
