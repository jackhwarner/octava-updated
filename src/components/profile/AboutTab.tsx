import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/hooks/useProfile';
interface AboutTabProps {
  profile: Profile | null;
}
export const AboutTab = ({
  profile
}: AboutTabProps) => {
  const experienceLevels = [{
    value: 'beginner',
    label: 'Beginner (0-2 years)'
  }, {
    value: 'intermediate',
    label: 'Intermediate (2-5 years)'
  }, {
    value: 'advanced',
    label: 'Advanced (5-10 years)'
  }, {
    value: 'professional',
    label: 'Professional (10+ years)'
  }];
  return <div className="space-y-6">
      <Card>
        <CardHeader className="">
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6 pt-0 ">
          <div>
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-gray-600">
              {profile?.bio || 'No bio available. Click "Edit Profile" to add one.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Experience Level</h3>
              {/* Remove hover styles by setting static bg & text and no hover class */}
              <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-xs pointer-events-none">
                {experienceLevels.find(level => level.value === profile?.experience)?.label || 'Not specified'}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Instruments</h3>
              <div className="flex flex-wrap gap-3">
                {profile?.skills?.length ? profile.skills.map(skill => <Badge key={skill} className="bg-white border-gray-300 text-gray-800 px-4 py-2 text-xs pointer-events-none">
                    {skill}
                  </Badge>) : <p className="text-gray-500 text-sm">No skills listed</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};