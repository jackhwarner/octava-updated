
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import FollowingMutuals from './following/FollowingMutuals';
import FollowingRequests from './following/FollowingRequests';

const Following = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold text-gray-900 mb-2 text-3xl">Connections</h1>
          <p className="text-gray-600">Manage your connections and connection requests</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <TabsContent value="connections">
            <FollowingMutuals searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="requests">
            <FollowingRequests searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Following;
