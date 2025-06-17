import { Music } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
  currentFolderId: string | null;
  currentFolderName?: string;
}

export const EmptyState = ({ searchTerm, currentFolderId, currentFolderName }: EmptyStateProps) => {
  const getEmptyMessage = () => {
    if (searchTerm) {
      return 'Try adjusting your search terms';
    } else if (currentFolderId) {
      return 'This folder is empty';
    } else {
      return 'Create your first project to get started';
    }
  };

  return (
    <div className="text-center py-12">
      <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
      <p className="text-gray-500 mb-4">{getEmptyMessage()}</p>
    </div>
  );
};
