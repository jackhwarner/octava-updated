
import { Music } from 'lucide-react';
import { SuggestedProjectCard } from './SuggestedProjectCard';

const FilteredSuggestedProjects = ({ filteredSuggestedProjects }) => {
  if (!filteredSuggestedProjects.length) return null;
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
        <Music className="w-6 h-6 mr-2 text-purple-600" />
        Suggested Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuggestedProjects.map(project => (
          <SuggestedProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default FilteredSuggestedProjects;
