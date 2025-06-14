
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import BasicInfoCard from './settings/BasicInfoCard';
import TimelineCard from './settings/TimelineCard';
import CollaborationSettingsCard from './settings/CollaborationSettingsCard';
import DangerZoneCard from './settings/DangerZoneCard';
import { useProjectSettingsForm } from '@/hooks/useProjectSettingsForm';

interface ProjectSettingsProps {
  project: any;
}

const ProjectSettings = ({ project }: ProjectSettingsProps) => {
  const { toast } = useToast();
  const { updateProject, deleteProject } = useProjects();
  const {
    formData,
    saving,
    deleting,
    handleInputChange,
    handleSave,
    handleDeleteProject,
  } = useProjectSettingsForm(project, updateProject, deleteProject, toast);

  return (
    <div className="space-y-6">
      <BasicInfoCard
        title={formData.title}
        genre={formData.genre}
        description={formData.description}
        visibility={formData.visibility}
        onChange={handleInputChange}
      />

      <TimelineCard
        deadline={formData.deadline}
        onChange={handleInputChange}
      />

      <CollaborationSettingsCard />

      <div className="flex items-center justify-between">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Separator />

      <DangerZoneCard onDelete={handleDeleteProject} deleting={deleting} />
    </div>
  );
};

export default ProjectSettings;
