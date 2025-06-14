
import { useState } from "react";

type ProjectSettingsFormData = {
  title: string;
  description: string;
  genre: string;
  status: string;
  visibility: string;
  deadline: string;
  budget: string;
  mood: string;
};

export function useProjectSettingsForm(project: any, updateProject: any, deleteProject: any, toast: any) {
  const [formData, setFormData] = useState<ProjectSettingsFormData>({
    title: project.title || '',
    description: project.description || '',
    genre: project.genre || '',
    status: project.status || 'active',
    visibility: project.visibility || 'private',
    deadline: project.deadline || '',
    budget: project.budget || '',
    mood: project.mood || '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject(project.id, {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        status: formData.status as any,
        visibility: formData.visibility as any,
        deadline: formData.deadline || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        mood: formData.mood,
      });
      toast({
        title: "Settings saved",
        description: "Project settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setDeleting(true);
      try {
        await deleteProject(project.id);
        toast({
          title: "Project deleted",
          description: "The project has been permanently deleted."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive"
        });
      } finally {
        setDeleting(false);
      }
    }
  };

  return {
    formData,
    saving,
    deleting,
    handleInputChange,
    handleSave,
    handleDeleteProject,
  };
}
