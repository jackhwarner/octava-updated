
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import type { Folder as FolderType } from '@/hooks/useFolders';
import type { Project } from '@/types/project';

interface FolderCardProps {
  folder: FolderType;
  projects: Project[];
  onClick: (folderId: string) => void;
}

export const FolderCard = ({ folder, projects, onClick }: FolderCardProps) => {
  const projectCount = projects.filter(p => p.folder_id === folder.id).length;

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(folder.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded flex items-center justify-center" 
            style={{ backgroundColor: folder.color }}
          >
            <Folder className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{folder.name}</h3>
            <p className="text-xs text-gray-500">{projectCount} projects</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
