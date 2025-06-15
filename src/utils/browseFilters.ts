
export const filterCollaborators = (
  collaborators,
  { selectedRole, selectedGenre, selectedInstrument, selectedExperience, location }
) => {
  return collaborators.filter(collaborator => {
    const roleMatch = selectedRole ? collaborator.role === selectedRole : true;
    const genreMatch = selectedGenre ? collaborator.genres.includes(selectedGenre) : true;
    const instrumentMatch = selectedInstrument ? (collaborator.instruments?.includes(selectedInstrument) || collaborator.skills?.includes(selectedInstrument)) : true;
    const experienceMatch = selectedExperience ? collaborator.experience === selectedExperience : true;
    const locationMatch = location ? (collaborator.location?.toLowerCase().includes(location.toLowerCase())) : true;
    return roleMatch && genreMatch && instrumentMatch && experienceMatch && locationMatch;
  });
};

export const filterSuggestedProjects = (projects, profile) => {
  if (!profile) return [];
  const userGenres = profile.genres || [];
  const userRole = profile.role;

  return projects.filter(project => {
    const genreMatch = project.genre ? userGenres.includes(project.genre) : true;
    const lookingForRoles = project.project_looking_for.map(item => item.role).filter(role => role !== null) as string[];
    const roleMatch = userRole ? lookingForRoles.includes(userRole) : true;
    return genreMatch && roleMatch;
  });
};
