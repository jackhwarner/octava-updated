
/**
 * Returns true if the profile is setup (either profile_setup_completed === true OR required fields present)
 */
export const isProfileSetupComplete = (profile: any) => {
  console.log('isProfileSetupComplete: Checking profile:', profile);
  
  if (profile?.profile_setup_completed === true) {
    console.log('isProfileSetupComplete: Profile marked as completed');
    return true;
  }
  
  const hasRequiredFields = (
    !!profile?.name &&
    !!profile?.username &&
    !!profile?.bio &&
    !!profile?.location &&
    !!profile?.experience
  );
  
  console.log('isProfileSetupComplete: Required fields check:', {
    name: !!profile?.name,
    username: !!profile?.username,
    bio: !!profile?.bio,
    location: !!profile?.location,
    experience: !!profile?.experience,
    hasRequiredFields
  });
  
  return hasRequiredFields;
};
