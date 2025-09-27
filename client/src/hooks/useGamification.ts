import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UserProgress, UserAchievement } from "@shared/schema";

// Hook for user progress (streaks, levels, XP)
export function useUserProgress() {
  return useQuery<UserProgress>({
    queryKey: ['/api/progress'],
    staleTime: 30000, // Fresh for 30 seconds
  });
}

// Hook for user achievements (badges, milestones)
export function useUserAchievements() {
  return useQuery<UserAchievement[]>({
    queryKey: ['/api/achievements'],
    staleTime: 60000, // Fresh for 1 minute
  });
}

// Hook for checking and unlocking new achievements
export function useCheckAchievements() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => fetch('/api/achievements/check', {
      method: 'POST',
    }).then(res => res.json()),
    onSuccess: (newAchievements) => {
      // Invalidate achievements cache to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      return newAchievements;
    },
  });
}

// Hook for charity effectiveness data
export function useCharityEffectiveness(charityKey?: string) {
  return useQuery({
    queryKey: charityKey ? ['/api/charities', charityKey] : ['/api/charities'],
    enabled: !!charityKey,
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
  });
}

// Hook for all charity data
export function useAllCharities() {
  return useQuery({
    queryKey: ['/api/charities'],
    staleTime: 10 * 60 * 1000, // Fresh for 10 minutes
  });
}

// Hook for completing onboarding
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiRequest('POST', '/api/onboarding/complete'),
    onSuccess: () => {
      // Invalidate progress cache to refetch with onboardingCompleted = true
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });
}