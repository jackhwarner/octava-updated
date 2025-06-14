
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProjectFileUpload({ projectId, currentUser, onFileUploaded, fetchExistingFiles, toast }: any) {
  const [uploading, setUploading] = useState(false);
  const [replaceInfo, setReplaceInfo] = useState<{ file: File; exists: any } | null>(null);

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
        version: 1,
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

  // Delete previous file then upload the replacement
  const handleConfirmReplace = async () => {
    if (!replaceInfo) return;
    setUploading(true);
    try {
      const { error } = await supabase
        .from("project_files")
        .delete()
        .eq("id", replaceInfo.exists.id);
      if (error) throw error;
      await doUpload(replaceInfo.file);
    } catch (error: any) {
      toast({
        title: "Could not replace file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setReplaceInfo(null);
      setUploading(false);
      // Refetch files after operation
      await fetchExistingFiles();
    }
  };
  const handleCancelReplace = () => {
    setReplaceInfo(null);
  };

  return {
    uploading,
    replaceInfo,
    setReplaceInfo,
    doUpload,
    handleConfirmReplace,
    handleCancelReplace,
    setUploading,
  };
}
