import { useMemo } from 'react';
import { useDonations } from './useDonations';
import type { Donation } from '@shared/schema';

interface ChartDataPoint {
  name: string;
  value: number;
}

type TimePeriod = 'monthly' | 'annual' | 'lifetime';

export function useChartData(period: TimePeriod) {
  const { donations, isLoading } = useDonations();

  const chartData = useMemo(() => {
    if (!donations || donations.length === 0) {
      return {
        donationTrends: [] as ChartDataPoint[],
        impactTrends: [] as ChartDataPoint[],
        categoryBreakdown: [] as ChartDataPoint[],
      };
    }

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        break;
      case 'annual':
        startDate = new Date(now.getFullYear() - 4, 0, 1);
        break;
      case 'lifetime':
        startDate = new Date(Math.min(...donations.map(d => new Date(d.donationDate).getTime())));
        break;
    }

    // Filter donations by time period
    const filteredDonations = donations.filter(donation => 
      new Date(donation.donationDate) >= startDate
    );

    // Generate donation trends
    const donationTrends = generateTimeSeries(filteredDonations, period, 'donations');
    
    // Generate impact trends (simplified - uses basic GiveWell estimates)
    const impactTrends = generateTimeSeries(filteredDonations, period, 'impact');

    // Generate category breakdown
    const categoryBreakdown = generateCategoryBreakdown(filteredDonations);

    return {
      donationTrends,
      impactTrends,
      categoryBreakdown,
    };
  }, [donations, period]);

  return {
    ...chartData,
    isLoading,
  };
}

function generateTimeSeries(
  donations: Donation[], 
  period: TimePeriod, 
  type: 'donations' | 'impact'
): ChartDataPoint[] {
  const now = new Date();
  const groupedData: Record<string, number> = {};

  // First, populate with actual donations
  donations.forEach(donation => {
    const date = new Date(donation.donationDate);
    let key: string;

    if (period === 'monthly') {
      key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      key = date.getFullYear().toString();
    }

    const amount = parseFloat(donation.amount);
    
    if (type === 'donations') {
      groupedData[key] = (groupedData[key] || 0) + amount;
    } else {
      // Basic impact calculation (lives saved estimate: $3000 per life saved)
      const livesSaved = amount / 3000;
      groupedData[key] = (groupedData[key] || 0) + livesSaved;
    }
  });

  // Generate complete time periods with zeros for missing periods
  let timePeriods: string[] = [];
  
  if (period === 'monthly') {
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      timePeriods.push(key);
    }
  } else if (period === 'annual') {
    // Generate last 5 years
    for (let i = 4; i >= 0; i--) {
      const year = (now.getFullYear() - i).toString();
      timePeriods.push(year);
    }
  } else {
    // For lifetime, get range from first donation to now, grouped by year
    if (donations.length > 0) {
      const earliestYear = Math.min(...donations.map(d => new Date(d.donationDate).getFullYear()));
      const currentYear = now.getFullYear();
      for (let year = earliestYear; year <= currentYear; year++) {
        timePeriods.push(year.toString());
      }
    } else {
      // No donations, show current year
      timePeriods.push(now.getFullYear().toString());
    }
  }

  // Build final data points with zeros for missing periods
  return timePeriods.map(period => ({
    name: period,
    value: Math.round((groupedData[period] || 0) * 100) / 100
  }));
}

function generateCategoryBreakdown(donations: Donation[]): ChartDataPoint[] {
  const categoryTotals: Record<string, number> = {};

  donations.forEach(donation => {
    const amount = parseFloat(donation.amount);
    const category = donation.charityCategory || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}