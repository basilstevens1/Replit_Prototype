import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Trophy, TrendingUp } from "lucide-react";
import { useUserProgress } from "@/hooks/useGamification";

export default function ProgressTracker() {
  const { data: progress, isLoading } = useUserProgress();

  if (isLoading) {
    return (
      <Card data-testid="card-progress-tracker">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Progress
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

  if (!progress) {
    return null;
  }

  const xpForNextLevel = 100; // 100 XP per level
  const currentLevelXP = (progress.experiencePoints || 0) % xpForNextLevel;
  const xpProgress = (currentLevelXP / xpForNextLevel) * 100;

  const nextMilestone = parseFloat(progress.nextMilestone || "100");
  const currentTotal = progress.totalDonations || 0;

  return (
    <Card data-testid="card-progress-tracker">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level & Experience */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Level {progress.level}</span>
            </div>
            <Badge variant="secondary" data-testid="badge-experience-points">
              {progress.experiencePoints} XP
            </Badge>
          </div>
          <Progress value={xpProgress} className="h-2" data-testid="progress-experience" />
          <p className="text-sm text-muted-foreground">
            {xpForNextLevel - currentLevelXP} XP to level {(progress.level || 1) + 1}
          </p>
        </div>

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

        {/* Next Milestone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Next Milestone</span>
            <Badge variant="outline" data-testid="badge-next-milestone">
              ${nextMilestone.toLocaleString()}
            </Badge>
          </div>
          <Progress 
            value={Math.min((currentTotal / nextMilestone) * 100, 100)} 
            className="h-2" 
            data-testid="progress-milestone"
          />
          <p className="text-sm text-muted-foreground">
            ${Math.max(0, nextMilestone - currentTotal).toLocaleString()} to reach milestone
          </p>
        </div>

        {/* Impact Score */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-medium">Impact Score</span>
          <span className="text-lg font-semibold text-primary" data-testid="text-impact-score">
            {parseFloat(progress.totalImpactScore || "0").toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}