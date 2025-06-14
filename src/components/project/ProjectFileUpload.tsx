import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import ReplaceFileDialog from './ReplaceFileDialog';
import ProjectFileDropzone from "./ProjectFileDropzone";
import { useProjectFileUpload } from "@/hooks/useProjectFileUpload";

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
  useState(() => {
    fetchExistingFiles();
    // eslint-disable-next-line
  }, []);

  // Use custom hook for upload logic
  const {
    uploading: uploadingFile,
    replaceInfo,
    setReplaceInfo,
    doUpload,
    handleConfirmReplace,
    handleCancelReplace,
  } = useProjectFileUpload({
    projectId,
    currentUser,
    onFileUploaded,
    fetchExistingFiles,
    toast,
  });

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
        <ProjectFileDropzone
          uploading={uploading || uploadingFile}
          handleFileInputChange={handleFileInputChange}
          onDrop={handleDrop}
          onDrag={handleDrag}
          dragActive={dragActive}
          isOwner={isOwner}
          projectSettings={projectSettings}
          fileInputRef={fileInputRef}
        />
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
