
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-full h-[98vh] max-h-[720px] flex flex-col p-0 overflow-hidden">
        <div className="flex-1 min-h-0 h-full overflow-y-auto flex flex-col bg-background rounded-lg">
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
                actionButton={
                  <ConnectionButton
                    userId={collaborator.id}
                    userName={collaborator.name}
                    size="lg"
                  />
                }
                isOwnProfile={false}
                showEdit={false}
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
      </DialogContent>
    </Dialog>
  );
};
