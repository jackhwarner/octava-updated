
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const LinksTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social & Streaming Links</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No links added yet</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
