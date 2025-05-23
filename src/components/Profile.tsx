import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Edit, Play, Pause, ExternalLink, Plus } from 'lucide-react';

const Profile = () => {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

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

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0"></div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Alex Rodriguez</h1>
                    <p className="text-xl text-gray-600">@alex_producer</p>
                  </div>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-100 text-purple-700 px-3 py-1">Producer</Badge>
                  <Badge variant="outline">Hip-Hop</Badge>
                  <Badge variant="outline">R&B</Badge>
                  <Badge variant="outline">Pop</Badge>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  Los Angeles, CA
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">127</div>
                    <div className="text-sm text-gray-500">Collaborations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">45K</div>
                    <div className="text-sm text-gray-500">Plays</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">892</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">234</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <h3 className="font-semibold mb-2">Experience Level</h3>
                    <p className="text-gray-600">Professional (10+ years)</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Instruments</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Piano</Badge>
                      <Badge variant="outline">Guitar</Badge>
                      <Badge variant="outline">Drums</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Primary Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Hip-Hop</Badge>
                      <Badge variant="outline">R&B</Badge>
                      <Badge variant="outline">Pop</Badge>
                      <Badge variant="outline">Soul</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-gray-600">Los Angeles, CA (90210)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
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

          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social & Streaming Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialLinks.map((link) => (
                    <div key={link.platform} className="flex items-center justify-between p-4 border rounded-lg">
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
    </div>
  );
};

export default Profile;
