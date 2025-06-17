import { Dialog } from "../ui/dialog";
import { ProfileHeader } from "../profile/ProfileHeader";
import { ProfileStats } from "../profile/ProfileStats";
import { AboutTab } from "../profile/AboutTab";
import { MusicTab } from "../profile/MusicTab";
import { ProjectsTab } from "../profile/ProjectsTab";
import { LinksTab } from "../profile/LinksTab";
import { ConnectionButton } from "../connections/ConnectionButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TooltipProvider } from '../ui/tooltip';
import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import type { Profile } from '../../hooks/useProfile';

interface CollaboratorProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Profile | null;
}

export const CollaboratorProfileDialog = ({
  open,
  onOpenChange,
  collaborator
}: CollaboratorProfileDialogProps) => {
  const [fullProfile, setFullProfile] = useState<Profile | null>(collaborator);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    })();
  }, []);

  useEffect(() => {
    if (!collaborator || !open) {
      setFullProfile(null);
      setCityName("");
      setProjects([]);
      setLoading(false);
      return;
    }
    const fetchFullProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", collaborator.id)
          .single();

        if (!error && data) {
          const mappedProfile: Profile = {
            ...data,
            visibility: data.visibility === 'unlisted' ? 'connections_only' : data.visibility as 'public' | 'private' | 'connections_only'
          };
          setFullProfile(mappedProfile);
          if (data?.zip_code && data.zip_code.length === 5) {
            const resp = await fetch(`https://api.zippopotam.us/us/${data.zip_code}`);
            if (resp.ok) {
              const zip = await resp.json();
              const city = zip.places[0]["place name"];
              const state = zip.places[0]["state abbreviation"];
              setCityName(`${city}, ${state}`);
            }
          } else if (data.location) {
            setCityName(data.location);
          }
        }
      } catch (e) {
        setFullProfile(collaborator);
      }
      try {
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", collaborator.id);
        setProjects(projectsData || []);
      } catch (e) {}
      setLoading(false);
    };
    fetchFullProfile();
  }, [collaborator, open]);

  if (!collaborator) return null;

  const isOwnProfile = currentUserId === collaborator.id;

  // Purple connect button used for other profiles
  const connectActionButton = (
    !isOwnProfile && collaborator.id ? (
      <ConnectionButton
        userId={collaborator.id}
        userName={collaborator.name || ''}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow"
      />
    ) : null
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
          <div
            className="relative z-10 w-screen h-screen flex flex-col overflow-y-auto bg-background"
            style={{ maxWidth: "100vw", maxHeight: "100vh", borderRadius: 0 }}
          >
            {/* Back button, top left */}
            <button
              className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 bg-white/80 hover:bg-white text-gray-900 rounded-full px-3 py-2 shadow transition-all"
              onClick={() => onOpenChange(false)}
              tabIndex={0}
              aria-label="Back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <div className="flex-1 w-full flex flex-col items-center overflow-y-auto overflow-x-hidden pt-20 pb-10 px-3 sm:px-8">
              <div className="w-full max-w-4xl mx-auto">
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-10">
                    <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-6" />
                    <div className="h-5 w-32 rounded bg-gray-200 animate-pulse mb-2" />
                    <div className="h-4 w-48 rounded bg-gray-100 animate-pulse mb-4" />
                  </div>
                ) : (
                  <>
                    <ProfileHeader
                      profile={fullProfile as any}
                      cityName={cityName}
                      isOwnProfile={isOwnProfile}
                      actionButton={connectActionButton}
                    />
                    <ProfileStats
                      totalCollaborations={projects.length}
                      activeProjects={projects.filter((p: any) => p.status === 'active').length}
                      profile={fullProfile as any}
                    />
                    <TooltipProvider>
                      <Tabs
                        defaultValue="about"
                        className="mt-4"
                      >
                        <TabsList className="w-full grid grid-cols-4 gap-2 mb-2">
                          <TabsTrigger value="about" className="w-full">About</TabsTrigger>
                          <TabsTrigger value="music" className="w-full">Music</TabsTrigger>
                          <TabsTrigger value="projects" className="w-full">Projects</TabsTrigger>
                          <TabsTrigger value="links" className="w-full">Links</TabsTrigger>
                        </TabsList>
                        <TabsContent value="about">
                          <AboutTab profile={fullProfile as any} />
                        </TabsContent>
                        <TabsContent value="music">
                          <MusicTab userId={collaborator.id} isOwnProfile={isOwnProfile} />
                        </TabsContent>
                        <TabsContent value="projects">
                          <ProjectsTab projects={projects} isOwnProfile={isOwnProfile} />
                        </TabsContent>
                        <TabsContent value="links">
                          <LinksTab isOwnProfile={isOwnProfile} />
                        </TabsContent>
                      </Tabs>
                    </TooltipProvider>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};
