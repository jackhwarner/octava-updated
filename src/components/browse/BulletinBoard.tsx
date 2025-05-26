import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  genre: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'connections_only';
  created_at: string;
  owner_name?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  type: string;
  created_at: string;
}

const BulletinBoard = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for featured projects
    const mockFeaturedProjects: Project[] = [
      {
        id: '1',
        title: 'Summer Vibes',
        description: 'Upbeat pop track perfect for summer playlists',
        genre: 'Pop',
        status: 'active',
        visibility: 'public',
        created_at: '2024-01-15T10:00:00Z',
        owner_name: 'Sarah Johnson',
      },
      {
        id: '2',
        title: 'Midnight Drive',
        description: 'Chill synthwave instrumental for late night drives',
        genre: 'Electronic',
        status: 'on_hold',
        visibility: 'private',
        created_at: '2024-01-10T14:00:00Z',
        owner_name: 'Marcus Williams',
      },
    ];

    // Mock data for community bulletin board posts
    const mockPosts: Post[] = [
      {
        id: '101',
        title: 'Looking for a Vocalist',
        content: 'Seeking a female vocalist for a pop track. Must have experience with harmonies.',
        author: 'Alex Rodriguez',
        type: 'Collaboration',
        created_at: '2024-01-25T08:00:00Z',
      },
      {
        id: '102',
        title: 'Mixing and Mastering Services',
        content: 'Offering professional mixing and mastering services at affordable rates.',
        author: 'Emily Carter',
        type: 'Services',
        created_at: '2024-01-24T18:00:00Z',
      },
    ];

    setFeaturedProjects(mockFeaturedProjects);
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
        <div className="grid gap-4">
          {featuredProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{project.title}</h3>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{project.genre}</Badge>
                <Badge variant="outline">{project.visibility}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {project.owner_name || 'Unknown'}</span>
                <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Community Bulletin Board</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{post.title}</h3>
                <Badge variant="outline">{post.type}</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-2">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {post.author}</span>
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulletinBoard;
