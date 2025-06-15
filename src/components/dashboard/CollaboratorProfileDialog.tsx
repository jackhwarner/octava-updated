
import { Dialog } from "@/components/ui/dialog";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AboutTab } from "@/components/profile/AboutTab";
import { MusicTab } from "@/components/profile/MusicTab";
import { ProjectsTab } from "@/components/profile/ProjectsTab";
import { LinksTab } from "@/components/profile/LinksTab";
import { ConnectionButton } from "@/components/connections/ConnectionButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

type Collaborator = {
  id: string;
  name: string;
  username?: string;
  role?: string;
  genres?: string[];
  location?: string;
  experience?: string;
  avatar_url?: string;
  skills?: string[];
  email?: string;
  bio?: string;
  full_name?: string;
  visibility?: string;
  instruments?: string[];
  zip_code?: string;
  hourly_rate?: number;
};

interface CollaboratorProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator | null;
}

// For full-screen dialog, we just use a portal (for overlay) and mount a div that fills viewport
export const CollaboratorProfileDialog = ({
  open,
  onOpenChange,
  collaborator
}: CollaboratorProfileDialogProps) => {
  const [fullProfile, setFullProfile] = useState<Collaborator | null>(collaborator);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");

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
          setFullProfile(data);
          // Fetch city name if available from zip
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
        // fallback to limited profile info
        setFullProfile(collaborator);
      }
      // fetch projects
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
  // Dialog overlays are handled by the shadcn Dialog Root. We'll use a custom full-screen "sheet" design.

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />

          {/* Profile Content Fullscreen */}
          <div
            className="relative z-10 w-screen h-screen flex flex-col overflow-y-auto bg-background"
            style={{ maxWidth: "100vw", maxHeight: "100vh", borderRadius: 0 }}
          >
            {/* Back Button */}
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

            {/* Profile Main (center content/padding) */}
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
                    {/* ProfileHeader: Don't pass onEditClick, isOwnProfile = false */}
                    <ProfileHeader
                      profile={fullProfile as any}
                      cityName={cityName}
                      isOwnProfile={false}
                      actionButton={
                        <ConnectionButton
                          userId={collaborator.id}
                          userName={collaborator.name}
                          size="lg"
                          className="ml-auto"
                        />
                      }
                    />
                    <ProfileStats
                      totalCollaborations={projects.length}
                      activeProjects={projects.filter((p: any) => p.status === 'active').length}
                      profile={fullProfile as any}
                    />
                    <TooltipProvider>
                      <Tabs defaultValue="about" className="mt-4">
                        <TabsList>
                          <TabsTrigger value="about">About</TabsTrigger>
                          <TabsTrigger value="music">Music</TabsTrigger>
                          <TabsTrigger value="projects">Projects</TabsTrigger>
                          <TabsTrigger value="links">Links</TabsTrigger>
                        </TabsList>
                        <TabsContent value="about">
                          <AboutTab profile={fullProfile as any} />
                        </TabsContent>
                        <TabsContent value="music">
                          <MusicTab userId={collaborator.id} />
                        </TabsContent>
                        <TabsContent value="projects">
                          <ProjectsTab projects={projects} />
                        </TabsContent>
                        <TabsContent value="links">
                          <LinksTab profile={fullProfile as any} />
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
