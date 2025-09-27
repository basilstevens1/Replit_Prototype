import { useMemo } from 'react';
import { useDonations } from './useDonations';
import type { Donation } from '@shared/schema';
import waterStoryImage from '@assets/generated_images/Clean_water_project_story_573328ad.png';
import educationStoryImage from '@assets/generated_images/Education_program_story_cf00d503.png';
import healthStoryImage from '@assets/generated_images/Healthcare_access_story_923d8707.png';

interface Story {
  title: string;
  organization: string;
  location: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  impact: string;
  isUserConnected: boolean;
  userDonationAmount?: number;
  userDonationDate?: string;
}

export function useStories() {
  const { donations, isLoading } = useDonations();

  const stories = useMemo((): Story[] => {
    // Base story templates with impact data from research
    const storyTemplates = [
      {
        title: "Clean Water Transforms Village Life in Rural Kenya",
        organization: "charity: water",
        organizationId: "charity-water",
        location: "Kakamega, Kenya",
        date: "Nov 2024",
        excerpt: "Thanks to donations like yours, the village of Musanda now has access to clean, safe drinking water for the first time. Children no longer walk hours to collect water and can attend school regularly.",
        imageUrl: waterStoryImage,
        impact: "200 lives affected",
        category: "Water & Sanitation"
      },
      {
        title: "Girls' Education Program Opens Doors to Future",
        organization: "Malala Fund",
        organizationId: "malala-fund",
        location: "Chitral, Pakistan",
        date: "Oct 2024",
        excerpt: "Donations to education initiatives helped build a new classroom and provide school supplies for 45 girls in this remote mountain community. Many are the first in their families to receive formal education.",
        imageUrl: educationStoryImage,
        impact: "45 students empowered",
        category: "Education"
      },
      {
        title: "Mobile Health Clinic Reaches Remote Communities",
        organization: "Partners In Health",
        organizationId: "partners-in-health",
        location: "Madagascar",
        date: "Sep 2024",
        excerpt: "Mobile clinics funded by global health donations have provided essential healthcare to over 300 people in villages that previously had no medical access. Maternal mortality has decreased by 40%.",
        imageUrl: healthStoryImage,
        impact: "300 patients served",
        category: "Healthcare"
      },
      {
        title: "Malaria Prevention Nets Save Lives",
        organization: "Against Malaria Foundation",
        organizationId: "against-malaria",
        location: "Cameroon",
        date: "Aug 2024",
        excerpt: "Contributions to malaria prevention provided bed nets to 150 families, protecting them from malaria-carrying mosquitoes. Early data shows a 60% reduction in malaria cases in the distribution area.",
        imageUrl: waterStoryImage, // Reusing image for demo
        impact: "150 families protected",
        category: "Disease Prevention"
      }
    ];

    // Check which organizations the user has donated to
    const userCharities = new Set(donations?.map(d => d.charity) || []);
    const userDonationsMap = new Map<string, Donation[]>();
    
    donations?.forEach(donation => {
      const charityDonations = userDonationsMap.get(donation.charity) || [];
      charityDonations.push(donation);
      userDonationsMap.set(donation.charity, charityDonations);
    });

    return storyTemplates.map(template => {
      const isUserConnected = userCharities.has(template.organizationId);
      let userDonationAmount = 0;
      let userDonationDate = '';

      if (isUserConnected) {
        const userDonations = userDonationsMap.get(template.organizationId) || [];
        userDonationAmount = userDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        // Get most recent donation date
        const mostRecent = userDonations.sort((a, b) => 
          new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
        )[0];
        userDonationDate = mostRecent ? new Date(mostRecent.donationDate).toLocaleDateString() : '';
      }

      return {
        ...template,
        isUserConnected,
        userDonationAmount: isUserConnected ? userDonationAmount : undefined,
        userDonationDate: isUserConnected ? userDonationDate : undefined,
        excerpt: isUserConnected 
          ? template.excerpt.replace('donations like yours', 'your donations').replace('Donations to', 'Your donations to').replace('funded by global health donations', 'funded by your health donations').replace('Contributions to', 'Your contributions to')
          : template.excerpt
      };
    });
  }, [donations]);

  return {
    stories,
    isLoading,
  };
}