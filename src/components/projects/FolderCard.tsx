import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderIcon, ChevronRight, Music } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { FolderWithProjectCount } from '@/hooks/useFolders';

interface FolderCardProps {
  folder: FolderWithProjectCount;
  onDelete: () => Promise<void>;
}

const FolderCard = ({ folder, onDelete }: FolderCardProps) => {
  console.log('Rendering FolderCard:', folder.id, 'name:', folder.name, 'color:', folder.color);
  console.log('Folder object:', folder);
  const navigate = useNavigate();
  const location = useLocation();
  const isInFolderView = location.pathname.includes('/folder/');

  const handleClick = () => {
    navigate(`/projects/folder/${folder.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🗑️ FolderCard - Delete clicked for folder:', folder.id);
    await onDelete();
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: folder.color ? `${folder.color}20` : '#3b82f620' }}
            >
              <FolderIcon className="w-6 h-6" style={{ color: folder.color || '#3b82f6' }} />
            </div>
            <div>
              <h3 className="font-medium">{folder.name}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <Music className="w-4 h-4 mr-1" /> {folder.project_count} {folder.project_count === 1 ? 'project' : 'projects'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
