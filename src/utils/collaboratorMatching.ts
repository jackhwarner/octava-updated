
interface CollaboratorProfile {
  id: string;
  name: string;
  username: string | null;
  role: string;
  genres: string[];
  location: string | null;
  experience: string;
  avatar_url: string | null;
  skills: string[];
  is_online: boolean;
  visibility: string;
}

interface UserProfile {
  genres: string[];
  location: string | null;
  skills: string[];
}

// Simple distance calculation using city/state matching
// This is a simplified approach - in production you'd use proper geocoding
function calculateLocationScore(userLocation: string | null, collaboratorLocation: string | null): number {
  if (!userLocation || !collaboratorLocation) return 0;
  
  const userLoc = userLocation.toLowerCase().trim();
  const collabLoc = collaboratorLocation.toLowerCase().trim();
  
  // Exact match gets highest score
  if (userLoc === collabLoc) return 100;
  
  // Check if they share the same state (assuming format "City, State")
  const userParts = userLoc.split(',').map(p => p.trim());
  const collabParts = collabLoc.split(',').map(p => p.trim());
  
  if (userParts.length >= 2 && collabParts.length >= 2) {
    const userState = userParts[userParts.length - 1];
    const collabState = collabParts[collabParts.length - 1];
    
    if (userState === collabState) {
      // Same state gets medium score
      return 50;
    }
  }
  
  // Check if any part of the location matches (city names, etc.)
  for (const userPart of userParts) {
    for (const collabPart of collabParts) {
      if (userPart === collabPart && userPart.length > 2) {
        return 25;
      }
    }
  }
  
  return 0;
}

function calculateGenreScore(userGenres: string[], collaboratorGenres: string[]): number {
  if (!userGenres.length || !collaboratorGenres.length) return 0;
  
  const matches = userGenres.filter(genre => 
    collaboratorGenres.some(collabGenre => 
      collabGenre.toLowerCase() === genre.toLowerCase()
    )
  );
  
  // Return percentage of user's genres that match
  return (matches.length / userGenres.length) * 100;
}

export function rankCollaborators(
  collaborators: CollaboratorProfile[], 
  userProfile: UserProfile | null
): CollaboratorProfile[] {
  if (!userProfile) return collaborators;
  
  const rankedCollaborators = collaborators.map(collaborator => {
    const genreScore = calculateGenreScore(userProfile.genres || [], collaborator.genres || []);
    const locationScore = calculateLocationScore(userProfile.location, collaborator.location);
    
    // Weight genres most heavily (70%), then location (30%) - removed skills from algorithm
    const totalScore = (genreScore * 0.7) + (locationScore * 0.3);
    
    return {
      ...collaborator,
      matchScore: totalScore
    };
  });
  
  // Sort by match score (highest first), then by name for consistency
  return rankedCollaborators
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.name.localeCompare(b.name);
    })
    .map(({ matchScore, ...collaborator }) => collaborator); // Remove matchScore from final result
}
