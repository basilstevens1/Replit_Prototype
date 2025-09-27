import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertCircle, HelpCircle, Info } from "lucide-react";

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceMeterProps {
  level: ConfidenceLevel;
  className?: string;
  showTooltip?: boolean;
}

const confidenceConfig = {
  high: {
    icon: CheckCircle,
    label: 'High Confidence',
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Strong evidence from randomized controlled trials and rigorous research',
    dotColor: 'bg-green-500',
  },
  medium: {
    icon: AlertCircle,
    label: 'Medium Confidence',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Good evidence from observational studies and established research',
    dotColor: 'bg-yellow-500',
  },
  low: {
    icon: HelpCircle,
    label: 'Low Confidence',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    description: 'Estimated impact based on proxy measures and limited research',
    dotColor: 'bg-gray-500',
  },
};

export default function ConfidenceMeter({ 
  level, 
  className = "", 
  showTooltip = true 
}: ConfidenceMeterProps) {
  const config = confidenceConfig[level];
  const IconComponent = config.icon;

  const meter = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {/* Visual dots for confidence level */}
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          <div className={`w-2 h-2 rounded-full ${
            level === 'high' ? config.dotColor : 
            level === 'medium' ? 'bg-gray-300' : 'bg-gray-300'
          }`} />
          <div className={`w-2 h-2 rounded-full ${
            level === 'high' ? config.dotColor : 'bg-gray-300'
          }`} />
        </div>
        <IconComponent className="h-4 w-4" />
      </div>
      
      <Badge 
        variant="outline" 
        className={config.color}
        data-testid={`badge-confidence-${level}`}
      >
        {config.label}
      </Badge>
    </div>
  );

  if (!showTooltip) {
    return meter;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-help">
          {meter}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="font-medium">Confidence Level</span>
          </div>
          <p className="text-sm">{config.description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}