
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectDeadlineProps {
  deadline?: string;
}

const ProjectDeadline = ({ deadline }: ProjectDeadlineProps) => {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const timeDiff = deadlineDate.getTime() - now.getTime();
  const daysUntilDeadline = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const getDeadlineStatus = () => {
    if (daysUntilDeadline < 0) {
      return { 
        label: 'Overdue', 
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        timeText: `${Math.abs(daysUntilDeadline)} days overdue`
      };
    } else if (daysUntilDeadline === 0) {
      return { 
        label: 'Due Today', 
        color: 'bg-orange-100 text-orange-800',
        icon: Clock,
        timeText: 'Due today'
      };
    } else if (daysUntilDeadline <= 7) {
      return { 
        label: 'Due Soon', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        timeText: `${daysUntilDeadline} days remaining`
      };
    } else {
      return { 
        label: 'On Track', 
        color: 'bg-green-100 text-green-800',
        icon: Calendar,
        timeText: `${daysUntilDeadline} days remaining`
      };
    }
  };

  const status = getDeadlineStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <StatusIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Project Deadline</p>
              <p className="text-sm text-gray-600">{deadlineDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={status.color}>
              {status.label}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">{status.timeText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDeadline;
