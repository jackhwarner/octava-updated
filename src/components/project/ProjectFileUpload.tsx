
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ReplaceFileDialog from './ReplaceFileDialog';
import ProjectFileDropzone from "./ProjectFileDropzone";
import { Button } from '@/components/ui/button';

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
  const [replaceInfo, setReplaceInfo] = useState<{ file: File, exists: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch existing files for this project when component mounts
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

  const doUpload = async (file: File) => {
    setUploading(true);
    try {
      if (!currentUser) throw new Error("User not authenticated");
      const fileData = {
        project_id: projectId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_path: `projects/${projectId}/${file.name}`,
        uploaded_by: currentUser.id,
        description: `File uploaded: ${file.name}`,
        version_notes: null,
        is_pending_approval: false,
        approved_at: new Date().toISOString(),
        approved_by: currentUser.id,
        parent_file_id: null,
      };

      const { data, error } = await supabase
        .from("project_files")
        .insert([fileData])
        .select(
          `
          *,
          uploader:profiles!project_files_uploaded_by_fkey (
            name,
            username
          )
        `
        )
        .single();

      if (error) throw error;
      onFileUploaded(data);
      await fetchExistingFiles();
      toast({
        title: "File uploaded successfully",
        description: `${file.name} was uploaded to the project.`,
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
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
      // Delete the previous DB record by id
      const { error } = await supabase
        .from("project_files")
        .delete()
        .eq("id", replaceInfo.exists.id);
      if (error) throw error;
      await doUpload(replaceInfo.file);
      setReplaceInfo(null);
      await fetchExistingFiles();
    } catch (error: any) {
      toast({
        title: "Could not replace file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  const handleCancelReplace = () => {
    setReplaceInfo(null);
  };

  const handleFileUpload = async (selectedFiles: FileList) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const filesArr = Array.from(selectedFiles);
    for (const file of filesArr) {
      // Check if a file with the same name exists for this project
      const exists = existingFiles.find(f => f.file_name === file.name);
      if (exists) {
        setReplaceInfo({ file, exists });
        return; // Wait for user confirmation
      }
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
    if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") {
      setDragActive(e.type === "dragenter" || e.type === "dragover");
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
          uploading={uploading}
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
