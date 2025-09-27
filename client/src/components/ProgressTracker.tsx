import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, TrendingUp, Heart, Users, Target, Settings } from "lucide-react";
import { useState } from "react";
import { useUserProgress } from "@/hooks/useGamification";
import { useImpact } from "@/hooks/useImpact";

export default function ProgressTracker() {
  const { data: progress, isLoading } = useUserProgress();
  const { impactStats, isLoading: impactLoading } = useImpact();
  const [showTargetSettings, setShowTargetSettings] = useState(false);

  if (isLoading || impactLoading) {
    return (
      <Card data-testid="card-progress-tracker">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Impact Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progress || !impactStats) {
    return null;
  }

  // Calculate progress percentages for each impact metric
  const livesSavedTarget = parseFloat(progress.livesSavedTarget?.toString() || "1.0");
  const qualysGainedTarget = parseFloat(progress.qualysGainedTarget?.toString() || "10.0");
  const peopleHelpedTarget = progress.peopleHelpedTarget || 100;
  const totalDonatedTarget = parseFloat(progress.totalDonatedTarget?.toString() || "1000.00");

  const livesSavedProgress = Math.min((impactStats.livesSaved / livesSavedTarget) * 100, 100);
  const qualysGainedProgress = Math.min((impactStats.qualysGained / qualysGainedTarget) * 100, 100);
  const peopleHelpedProgress = Math.min((impactStats.peopleImpacted / peopleHelpedTarget) * 100, 100);
  const totalDonatedProgress = Math.min((impactStats.totalDonated / totalDonatedTarget) * 100, 100);

  return (
    <Card data-testid="card-progress-tracker">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Impact Progress
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTargetSettings(!showTargetSettings)}
            data-testid="button-toggle-target-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lives Saved Progress */}
        {progress.trackLivesSaved && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-chart-1" />
                <span className="font-medium">Lives Saved</span>
              </div>
              <Badge variant="secondary" data-testid="badge-lives-saved-progress">
                {impactStats.livesSaved.toFixed(1)} / {livesSavedTarget}
              </Badge>
            </div>
            <Progress value={livesSavedProgress} className="h-2" data-testid="progress-lives-saved" />
            <p className="text-sm text-muted-foreground">
              {Math.max(0, livesSavedTarget - impactStats.livesSaved).toFixed(1)} lives to reach target
            </p>
          </div>
        )}

        {/* QUALYs Gained Progress */}
        {progress.trackQualysGained && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                <span className="font-medium">QUALYs Gained</span>
              </div>
              <Badge variant="secondary" data-testid="badge-qualys-gained-progress">
                {impactStats.qualysGained.toFixed(1)} / {qualysGainedTarget}
              </Badge>
            </div>
            <Progress value={qualysGainedProgress} className="h-2" data-testid="progress-qualys-gained" />
            <p className="text-sm text-muted-foreground">
              {Math.max(0, qualysGainedTarget - impactStats.qualysGained).toFixed(1)} QUALYs to reach target
            </p>
          </div>
        )}

        {/* People Helped Progress */}
        {progress.trackPeopleHelped && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-chart-3" />
                <span className="font-medium">People Helped</span>
              </div>
              <Badge variant="secondary" data-testid="badge-people-helped-progress">
                {Math.round(impactStats.peopleImpacted).toLocaleString()} / {peopleHelpedTarget.toLocaleString()}
              </Badge>
            </div>
            <Progress value={peopleHelpedProgress} className="h-2" data-testid="progress-people-helped" />
            <p className="text-sm text-muted-foreground">
              {Math.max(0, peopleHelpedTarget - Math.round(impactStats.peopleImpacted)).toLocaleString()} people to reach target
            </p>
          </div>
        )}

        {/* Total Donated Progress */}
        {progress.trackTotalDonated && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-chart-4" />
                <span className="font-medium">Total Donated</span>
              </div>
              <Badge variant="secondary" data-testid="badge-total-donated-progress">
                ${impactStats.totalDonated.toLocaleString()} / ${totalDonatedTarget.toLocaleString()}
              </Badge>
            </div>
            <Progress value={totalDonatedProgress} className="h-2" data-testid="progress-total-donated" />
            <p className="text-sm text-muted-foreground">
              ${Math.max(0, totalDonatedTarget - impactStats.totalDonated).toLocaleString()} to reach target
            </p>
          </div>
        )}

        {/* Current Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">Current Streak</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" data-testid="text-current-streak">
              {progress.currentStreak || 0}
            </p>
            <p className="text-sm text-muted-foreground">days</p>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="font-medium">Best Streak</span>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold" data-testid="text-longest-streak">
              {progress.longestStreak || 0}
            </p>
            <p className="text-sm text-muted-foreground">days</p>
          </div>
        </div>

        {/* Target Settings Placeholder */}
        {showTargetSettings && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium">Target Settings</h4>
            <p className="text-sm text-muted-foreground">
              Target customization coming soon! You'll be able to set custom targets for each impact metric and toggle which ones to track.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}