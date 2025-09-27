import { useQuery } from "@tanstack/react-query";

interface ImpactStats {
  totalDonated: number;
  livesSaved: number;
  qualysGained: number;
  donationCount: number;
  peopleImpacted: number;
  confidenceLevel: string;
}

export function useImpact() {
  const { data: impactStats, isLoading, error } = useQuery<ImpactStats>({
    queryKey: ["/api/impact"],
    retry: false,
  });

  return {
    impactStats,
    isLoading,
    error,
    hasError: !!error,
  };
}