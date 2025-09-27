import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Flame, Trophy, TrendingUp, Heart, Users, Target, Settings, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProgress } from "@/hooks/useGamification";
import { useImpact } from "@/hooks/useImpact";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { updateTargetSettingsSchema, type UpdateTargetSettings } from "@shared/schema";

export default function ProgressTracker() {
  const { data: progress, isLoading } = useUserProgress();
  const { impactStats, isLoading: impactLoading } = useImpact();
  const { toast } = useToast();
  const [showTargetSettings, setShowTargetSettings] = useState(false);
  
  const form = useForm<UpdateTargetSettings>({
    resolver: zodResolver(updateTargetSettingsSchema),
    defaultValues: {
      livesSavedTarget: progress?.livesSavedTarget || 1.0,
      qualysGainedTarget: progress?.qualysGainedTarget || 10.0,
      peopleHelpedTarget: progress?.peopleHelpedTarget || 100,
      totalDonatedTarget: progress?.totalDonatedTarget || 1000.0,
      trackLivesSaved: progress?.trackLivesSaved ?? true,
      trackQualysGained: progress?.trackQualysGained ?? true,
      trackPeopleHelped: progress?.trackPeopleHelped ?? true,
      trackTotalDonated: progress?.trackTotalDonated ?? true,
    },
  });

  // Update form values when progress data changes
  useEffect(() => {
    if (progress) {
      form.reset({
        livesSavedTarget: progress.livesSavedTarget || 1.0,
        qualysGainedTarget: progress.qualysGainedTarget || 10.0,
        peopleHelpedTarget: progress.peopleHelpedTarget || 100,
        totalDonatedTarget: progress.totalDonatedTarget || 1000.0,
        trackLivesSaved: progress.trackLivesSaved ?? true,
        trackQualysGained: progress.trackQualysGained ?? true,
        trackPeopleHelped: progress.trackPeopleHelped ?? true,
        trackTotalDonated: progress.trackTotalDonated ?? true,
      });
    }
  }, [progress, form]);

  const onSubmit = async (data: UpdateTargetSettings) => {
    try {
      await apiRequest('/api/progress/targets', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      // Invalidate the cache to refresh the progress data
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      
      toast({
        title: "Targets Updated",
        description: "Your impact targets have been successfully updated.",
      });
      
      setShowTargetSettings(false);
    } catch (error) {
      console.error('Failed to update targets:', error);
      toast({
        title: "Error",
        description: "Failed to update targets. Please try again.",
        variant: "destructive",
      });
    }
  };

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

        {/* Target Settings Form */}
        {showTargetSettings && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Customize Your Impact Targets</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTargetSettings(false)}
                data-testid="button-close-target-settings"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Lives Saved Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="trackLivesSaved"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-track-lives-saved"
                            />
                          </FormControl>
                          <FormLabel className="flex items-center gap-2 !mt-0">
                            <Heart className="h-4 w-4 text-chart-1" />
                            Lives Saved Target
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="livesSavedTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="1.0"
                            disabled={!form.watch("trackLivesSaved")}
                            data-testid="input-lives-saved-target"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* QUALYs Gained Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="trackQualysGained"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-track-qualys-gained"
                            />
                          </FormControl>
                          <FormLabel className="flex items-center gap-2 !mt-0">
                            <TrendingUp className="h-4 w-4 text-chart-2" />
                            QUALYs Gained Target
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="qualysGainedTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="10.0"
                            disabled={!form.watch("trackQualysGained")}
                            data-testid="input-qualys-gained-target"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* People Helped Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="trackPeopleHelped"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-track-people-helped"
                            />
                          </FormControl>
                          <FormLabel className="flex items-center gap-2 !mt-0">
                            <Users className="h-4 w-4 text-chart-3" />
                            People Helped Target
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="peopleHelpedTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="100"
                            disabled={!form.watch("trackPeopleHelped")}
                            data-testid="input-people-helped-target"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Total Donated Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="trackTotalDonated"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-track-total-donated"
                            />
                          </FormControl>
                          <FormLabel className="flex items-center gap-2 !mt-0">
                            <Target className="h-4 w-4 text-chart-4" />
                            Total Donated Target ($)
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="totalDonatedTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="1000.00"
                            disabled={!form.watch("trackTotalDonated")}
                            data-testid="input-total-donated-target"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    data-testid="button-save-targets"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {form.formState.isSubmitting ? "Saving..." : "Save Targets"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTargetSettings(false)}
                    data-testid="button-cancel-targets"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}