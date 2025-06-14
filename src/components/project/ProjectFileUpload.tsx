
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import ReplaceFileDialog from './ReplaceFileDialog';

interface ProjectFileUploadProps {
  projectId: string;
  currentUser: any;
  projectSettings: any;
  onFileUploaded: (file: any) => void;
}

const ProjectFileUpload = ({ projectId, currentUser, projectSettings, onFileUploaded }: ProjectFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [replaceInfo, setReplaceInfo] = useState<{ file: File; exists: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { notifyFileUpload } = useNotifications();

  // Fetch existing files for this project when component mounts
  // and whenever a file is uploaded
  const fetchExistingFiles = async () => {
    const { data } = await supabase
      .from('project_files')
      .select('file_name, id')
      .eq('project_id', projectId);
    setExistingFiles(data || []);
  };

  // Fetch once on mount.
  // (In real app: maybe refetch on upload, or promote this up for better cache)
  useState(() => {
    fetchExistingFiles();
    // eslint-disable-next-line
  }, []);

  const handleFileUpload = async (selectedFiles: FileList) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const filesArr = Array.from(selectedFiles);
    for (const file of filesArr) {
      // Check if file exists (by name, in this project)
      const exists = existingFiles.find(f => f.file_name === file.name);
      if (exists) {
        setReplaceInfo({ file, exists });
        return; // Wait for user confirmation
      }
      // No conflict, upload directly
      await doUpload(file);
    }
  };

  const doUpload = async (file: File) => {
    setUploading(true);
    try {
      if (!currentUser) throw new Error('User not authenticated');
      const fileData = {
        project_id: projectId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_path: `projects/${projectId}/${file.name}`,
        uploaded_by: currentUser.id,
        description: `File uploaded: ${file.name}`,
        version: 1,
        is_pending_approval: false,
        approved_at: new Date().toISOString(),
        approved_by: currentUser.id,
        parent_file_id: null,
        version_notes: null
      };

      const { data, error } = await supabase
        .from('project_files')
        .insert([fileData])
        .select(`
          *,
          uploader:profiles!project_files_uploaded_by_fkey (
            name,
            username
          )
        `)
        .single();

      if (error) throw error;

      onFileUploaded(data);
      await fetchExistingFiles();
      toast({
        title: "File uploaded successfully",
        description: `${file.name} was uploaded to the project.`
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: `There was an error uploading: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Delete previous file then upload the replacement
  const handleConfirmReplace = async () => {
    if (!replaceInfo) return;
    setUploading(true);
    try {
      // Delete in DB
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', replaceInfo.exists.id);
      if (error) throw error;
      // Upload new file
      await doUpload(replaceInfo.file);
    } catch (error) {
      toast({
        title: "Could not replace file",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setReplaceInfo(null);
      setUploading(false);
      // Refetch files
      await fetchExistingFiles();
    }
  };
  const handleCancelReplace = () => {
    setReplaceInfo(null);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      handleFileUpload(selectedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const isOwner = currentUser?.id === projectSettings?.owner_id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button
                disabled={uploading}
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                accept="audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload audio, video, images, documents, and more
            </p>
            <p className="text-xs text-gray-400">
              Drag and drop files here or click to browse
            </p>
            {projectSettings?.version_approval_enabled && !isOwner && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Files with the same name will replace existing files after confirmation.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <ReplaceFileDialog
          open={!!replaceInfo}
          fileName={replaceInfo?.file.name || ''}
          onCancel={handleCancelReplace}
          onConfirm={handleConfirmReplace}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectFileUpload;
