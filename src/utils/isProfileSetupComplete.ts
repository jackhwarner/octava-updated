
/**
 * Returns true if the profile is setup (either profile_setup_completed === true OR required fields present)
 */
export const isProfileSetupComplete = (profile: any) => {
  if (profile?.profile_setup_completed === true) return true;
  return (
    !!profile?.name &&
    !!profile?.username &&
    !!profile?.bio &&
    !!profile?.location &&
    !!profile?.experience
  );
};
