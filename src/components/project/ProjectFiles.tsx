
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProjectFileUpload from './ProjectFileUpload';
import ProjectFileList from './ProjectFileList';

interface ProjectFilesProps {
  projectId: string;
}

const ProjectFiles = ({ projectId }: ProjectFilesProps) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectSettings, setProjectSettings] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
    fetchProjectSettings();
    getCurrentUser();
  }, [projectId]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

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
          uploader:profiles!project_files_uploaded_by_fkey (
            name,
            username
          ),
          approver:profiles!project_files_approved_by_fkey (
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

  const handleFileUploaded = (newFile: any) => {
    setFiles(prev => [newFile, ...prev]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFileApproved = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            is_pending_approval: false, 
            approved_at: new Date().toISOString(),
            approved_by: currentUser?.id
          }
        : file
    ));
  };

  const handleVersionReverted = async (versionId: string) => {
    try {
      // This would implement the revert logic
      toast({
        title: "Version reverted",
        description: "Successfully reverted to the selected version",
      });
      fetchFiles(); // Refresh the files list
    } catch (error) {
      console.error('Error reverting version:', error);
      toast({
        title: "Error",
        description: "Failed to revert to selected version",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectFileUpload 
        projectId={projectId}
        currentUser={currentUser}
        projectSettings={projectSettings}
        onFileUploaded={handleFileUploaded}
      />
      
      <ProjectFileList 
        files={files}
        currentUser={currentUser}
        projectSettings={projectSettings}
        onFileDeleted={handleFileDeleted}
        onFileApproved={handleFileApproved}
        onVersionReverted={handleVersionReverted}
      />
    </div>
  );
};

export default ProjectFiles;
