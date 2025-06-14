
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
  /** Immediately called when a file is deleted */
  onFileDeleted?: (fileId: string) => void;
}

const ProjectFileUpload = ({
  projectId,
  currentUser,
  projectSettings,
  onFileUploaded,
  onFileDeleted,
}: ProjectFileUploadProps) => {
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
      .select('file_name, id, version')
      .eq('project_id', projectId);
    setExistingFiles(data || []);
  };

  useState(() => {
    fetchExistingFiles();
    // eslint-disable-next-line
  }, []);

  // Find the highest version number for a given file name
  const getLatestVersionForFileName = (fileName: string) => {
    const matches = existingFiles.filter(f => f.file_name === fileName);
    if (matches.length === 0) return 1;
    const versions = matches.map(f => Number(f.version) || 1);
    return Math.max(...versions) || 1;
  };

  // Upload new file or replacement
  const doUpload = async (file: File, replaceVersion?: number) => {
    setUploading(true);
    try {
      if (!currentUser) throw new Error("User not authenticated");
      let version = 1;
      if (typeof replaceVersion === "number") {
        version = replaceVersion;
      } else {
        version = getLatestVersionForFileName(file.name) + 1;
      }
      const fileData = {
        project_id: projectId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_path: `projects/${projectId}/${file.name}`,
        uploaded_by: currentUser.id,
        description: `File uploaded: ${file.name}`,
        version: version,
        is_pending_approval: false,
        approved_at: new Date().toISOString(),
        approved_by: currentUser.id,
        parent_file_id: null,
        version_notes: null,
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

  // Delete previous file then upload the replacement file (with incremented version)
  const handleConfirmReplace = async () => {
    if (!replaceInfo) return;
    setUploading(true);
    try {
      // 1. Delete the previous DB record by id
      const { error } = await supabase
        .from("project_files")
        .delete()
        .eq("id", replaceInfo.exists.id);

      if (error) throw error;

      // 2. Immediately update parent file list so user sees removal without refresh
      if (onFileDeleted) {
        onFileDeleted(replaceInfo.exists.id);
      }

      // 3. Upload the replacement file with incremented version
      const previousVersion = Number(replaceInfo.exists.version) || 1;
      await doUpload(replaceInfo.file, previousVersion + 1);

      setReplaceInfo(null);
      // Immediately update local list to remove old, fetch fresh state for true reactivity
      fetchExistingFiles();
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

  // If a file exists, begin replacement flow
  const handleFileUpload = async (selectedFiles: FileList) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const filesArr = Array.from(selectedFiles);
    for (const file of filesArr) {
      const exists = existingFiles.find(f => f.file_name === file.name);
      if (exists) {
        setReplaceInfo({ file, exists });
        return; // Stop and wait for user to confirm replace
      }
      await doUpload(file); // Regular upload for new files, assigns version 2+ automatically over time
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
