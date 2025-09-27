import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Heart, Flame, Trophy, Star } from "lucide-react";
import { useUserAchievements } from "@/hooks/useGamification";
import type { UserAchievement } from "@shared/schema";

const iconMap = {
  Heart,
  Flame,
  Trophy,
  Star,
  Award,
};

const colorMap = {
  red: "bg-red-100 text-red-800 border-red-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200", 
  gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
};

function AchievementBadge({ achievement }: { achievement: UserAchievement }) {
  const IconComponent = iconMap[achievement.badgeIcon as keyof typeof iconMap] || Award;
  const colorClass = colorMap[achievement.badgeColor as keyof typeof colorMap] || colorMap.blue;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer hover-elevate ${colorClass}`}
          data-testid={`badge-achievement-${achievement.achievementType}`}
        >
          <IconComponent className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium text-center leading-tight">
            {achievement.title}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <p className="font-medium">{achievement.title}</p>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Recently'}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function AchievementsBadges() {
  const { data: achievements, isLoading } = useUserAchievements();

  if (isLoading) {
    return (
      <Card data-testid="card-achievements">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Card data-testid="card-achievements">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No achievements yet</p>
            <p className="text-sm text-muted-foreground">Make your first donation to start earning badges!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-achievements">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </div>
          <Badge variant="secondary" data-testid="badge-achievement-count">
            {achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}