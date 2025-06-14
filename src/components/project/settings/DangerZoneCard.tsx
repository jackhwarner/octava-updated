
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

type Props = {
  onDelete: () => void;
  deleting: boolean;
};

export default function DangerZoneCard({ onDelete, deleting }: Props) {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-red-600 mb-2">Delete Project</h4>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. All project data, files, and collaborations will be permanently deleted.
            </p>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
