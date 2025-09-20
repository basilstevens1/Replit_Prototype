import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ImpactMetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
  color: 'green' | 'blue' | 'orange';
}

export default function ImpactMetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  description, 
  color 
}: ImpactMetricCardProps) {
  const colorClasses = {
    green: 'text-chart-1 border-chart-1/20 bg-chart-1/5',
    blue: 'text-chart-2 border-chart-2/20 bg-chart-2/5',
    orange: 'text-chart-3 border-chart-3/20 bg-chart-3/5'
  };

  return (
    <Card className="hover-elevate" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Badge variant="secondary" className={colorClasses[color]}>
          {changeType === 'increase' ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {change}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}