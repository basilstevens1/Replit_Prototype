import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Donation, InsertDonation } from "@shared/schema";

export function useDonations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
    retry: false,
  });

  const createDonationMutation = useMutation({
    mutationFn: async (donation: InsertDonation) => {
      return await apiRequest("POST", "/api/donations", donation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/impact"] });
      toast({
        title: "Success",
        description: "Donation added successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteDonationMutation = useMutation({
    mutationFn: async (donationId: string) => {
      return await apiRequest("DELETE", `/api/donations/${donationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/impact"] });
      toast({
        title: "Success",
        description: "Donation deleted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    donations,
    isLoading,
    createDonation: createDonationMutation.mutate,
    deleteDonation: deleteDonationMutation.mutate,
    isCreating: createDonationMutation.isPending,
    isDeleting: deleteDonationMutation.isPending,
  };
}