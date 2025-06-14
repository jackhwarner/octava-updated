
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CollaborationSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="replacement-mode">Replacement Mode</Label>
            <p className="text-sm text-gray-500">
              If you upload a file with the same name, the old file is replaced.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
