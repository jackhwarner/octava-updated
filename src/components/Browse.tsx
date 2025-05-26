
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BrowseFilters from './browse/BrowseFilters';
import SearchResults from './browse/SearchResults';
import SpotlightProjects from './browse/SpotlightProjects';
import BulletinBoard from './browse/BulletinBoard';
import SuggestedCollaborators from './browse/SuggestedCollaborators';
import { useProfile } from '@/hooks/useProfile';

const Browse = () => {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse & Discover</h1>
          <p className="text-gray-600">Find collaborators, projects, and opportunities</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="bulletin">Bulletin Board</TabsTrigger>
            <TabsTrigger value="spotlight">Spotlight</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <BrowseFilters 
                selectedRole=""
                setSelectedRole={() => {}}
                selectedGenre=""
                setSelectedGenre={() => {}}
                selectedInstrument=""
                setSelectedInstrument={() => {}}
                selectedExperience=""
                setSelectedExperience={() => {}}
                selectedAvailability=""
                setSelectedAvailability={() => {}}
                location=""
                setLocation={() => {}}
                onSearch={() => {}}
              />
            </div>
            
            <div className="lg:col-span-3">
              <TabsContent value="projects" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects Looking for Collaborators</CardTitle>
                    <CardDescription>
                      Discover exciting music projects that need your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SearchResults profiles={[]} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaborators" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Collaborators</CardTitle>
                    <CardDescription>
                      Connect with talented musicians and producers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SuggestedCollaborators />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulletin" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Bulletin Board</CardTitle>
                    <CardDescription>
                      Latest announcements, opportunities, and discussions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BulletinBoard />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spotlight" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Projects</CardTitle>
                    <CardDescription>
                      Highlighted projects and success stories from our community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpotlightProjects projects={[]} />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Browse;
