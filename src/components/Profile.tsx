
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Edit, Play, Pause, ExternalLink, Plus, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Profile = () => {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('Alex Rodriguez');
  const [editUsername, setEditUsername] = useState('@alex_producer');
  const [editBio, setEditBio] = useState('Professional music producer with over 10 years of experience in hip-hop, R&B, and pop. Passionate about creating innovative sounds and collaborating with talented artists. Credits include work with major label artists and independent musicians worldwide.');
  const [editLocation, setEditLocation] = useState('Los Angeles, CA');

  const socialLinks = [
    { platform: 'Spotify', url: 'https://spotify.com/artist/username', color: 'text-green-600' },
    { platform: 'Apple Music', url: 'https://music.apple.com/artist/username', color: 'text-gray-800' },
    { platform: 'YouTube', url: 'https://youtube.com/@username', color: 'text-red-600' },
    { platform: 'TikTok', url: 'https://tiktok.com/@username', color: 'text-black' },
    { platform: 'Instagram', url: 'https://instagram.com/username', color: 'text-pink-600' },
    { platform: 'SoundCloud', url: 'https://soundcloud.com/username', color: 'text-orange-600' },
  ];

  const tracks = [
    { id: 1, title: 'Summer Nights', duration: '3:42', plays: 1250 },
    { id: 2, title: 'Midnight Drive', duration: '4:15', plays: 892 },
    { id: 3, title: 'City Lights', duration: '3:28', plays: 2104 },
  ];

  const handlePlayPause = (trackId: number) => {
    setIsPlaying(isPlaying === trackId ? null : trackId);
  };

  const handleSaveProfile = () => {
    // Here you would typically save the profile
    setShowEditDialog(false);
  };

  return (
    <div className="p-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-28 h-28 bg-gray-300 rounded-full flex-shrink-0"></div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Alex Rodriguez</h1>
                    <p className="text-lg text-gray-600 mt-2">@alex_producer</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-100 text-purple-700 px-3 py-1.5 text-sm">Producer</Badge>
                    <Badge variant="outline" className="px-3 py-1.5 text-sm">Hip-Hop</Badge>
                    <Badge variant="outline" className="px-3 py-1.5 text-sm">R&B</Badge>
                    <Badge variant="outline" className="px-3 py-1.5 text-sm">Pop</Badge>
                  </div>
                  
                  <div className="inline-flex items-center text-gray-900 px-5 py-2 border border-gray-300 rounded ml-auto mt-3 md:mt-0">
                    <MapPin className="w-4 h-4 mr-2 text-gray-900" />
                    Los Angeles, CA
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <Card className="mb-8">
          <CardContent className="py-6 px-8">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">127</div>
                <div className="text-sm text-gray-500">Collaborations</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">45K</div>
                <div className="text-sm text-gray-500">Plays</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">892</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">234</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-gray-600">
                    Professional music producer with over 10 years of experience in hip-hop, R&B, and pop. 
                    Passionate about creating innovative sounds and collaborating with talented artists. 
                    Credits include work with major label artists and independent musicians worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Experience Level</h3>
                    <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-xs">Professional (10+ years)</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Instruments</h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="px-4 py-2 text-xs">Piano</Badge>
                      <Badge variant="outline" className="px-4 py-2 text-xs">Guitar</Badge>
                      <Badge variant="outline" className="px-4 py-2 text-xs">Drums</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="space-y-2">
                      <div className="font-medium">{day}</div>
                      <div className="bg-green-100 text-green-800 rounded px-2 py-2 text-xs">10am - 2pm</div>
                      <div className="bg-green-100 text-green-800 rounded px-2 py-2 text-xs">6pm - 10pm</div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Tracks</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {tracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-5 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayPause(track.id)}
                          className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200"
                        >
                          {isPlaying === track.id ? (
                            <Pause className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Play className="w-4 h-4 text-purple-600" />
                          )}
                        </Button>
                        <div>
                          <h4 className="font-medium">{track.title}</h4>
                          <p className="text-sm text-gray-500">{track.duration} • {track.plays} plays</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="h-28 bg-purple-100 relative"></div>
                    <CardHeader className="pb-0 p-5">
                      <CardTitle className="text-lg">Summer Vibes</CardTitle>
                      <p className="text-sm text-gray-500">Upbeat pop track</p>
                    </CardHeader>
                    <CardContent className="p-5 pt-2">
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">Pop</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="h-28 bg-purple-100 relative"></div>
                    <CardHeader className="pb-0 p-5">
                      <CardTitle className="text-lg">Urban Echoes</CardTitle>
                      <p className="text-sm text-gray-500">Hip-hop collaboration</p>
                    </CardHeader>
                    <CardContent className="p-5 pt-2">
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">Hip-Hop</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social & Streaming Links</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialLinks.map((link) => (
                    <div key={link.platform} className="flex items-center justify-between p-5 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${link.color}`}>
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{link.platform}</h4>
                          <p className="text-sm text-gray-500">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <Button variant="secondary" size="sm" className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={editBio} 
                onChange={(e) => setEditBio(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="producer">
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="songwriter">Songwriter</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="instrumentalist">Instrumentalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select defaultValue="professional">
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Genres (You can select multiple)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="hiphop">Hip-Hop</SelectItem>
                  <SelectItem value="rnb">R&B</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
