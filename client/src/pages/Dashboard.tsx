import { useState } from 'react';
import Header from '@/components/Header';
import ImpactMetricCard from '@/components/ImpactMetricCard';
import StoryCard from '@/components/StoryCard';
import ImpactChart from '@/components/ImpactChart';
import TimePeriodSelector from '@/components/TimePeriodSelector';
import DonationForm from '@/components/DonationForm';
import ThemeToggle from '@/components/ThemeToggle';
import ProgressTracker from '@/components/ProgressTracker';
import AchievementsBadges from '@/components/AchievementsBadges';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';
import { useImpact } from '@/hooks/useImpact';
import { useChartData } from '@/hooks/useChartData';
import { useStories } from '@/hooks/useStories';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<'qualitative' | 'quantitative'>('qualitative');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const { donations, isLoading: donationsLoading } = useDonations();
  const { impactStats, isLoading: impactLoading, hasError: impactError } = useImpact();
  const { donationTrends, impactTrends, categoryBreakdown, isLoading: chartLoading } = useChartData(selectedPeriod);
  const { stories, isLoading: storiesLoading } = useStories();


  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="flex items-center justify-between lg:justify-start gap-2">
              <ThemeToggle />
              <Button 
                onClick={() => setShowDonationForm(!showDonationForm)}
                size="sm"
                className="flex items-center gap-2"
                data-testid="button-toggle-donation-form"
              >
                <Plus className="h-4 w-4" />
                Add Donation
              </Button>
            </div>
            
            {showDonationForm && (
              <div className="lg:hidden">
                <DonationForm />
              </div>
            )}
            
            <div className="hidden lg:block">
              <TimePeriodSelector 
                selectedPeriod={selectedPeriod} 
                onPeriodChange={setSelectedPeriod} 
              />
            </div>
            
            <div className="hidden lg:block">
              {showDonationForm && <DonationForm />}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Mobile Time Period Selector */}
            <div className="lg:hidden">
              <TimePeriodSelector 
                selectedPeriod={selectedPeriod} 
                onPeriodChange={setSelectedPeriod} 
              />
            </div>

            {/* Enhanced Impact Metrics with Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ImpactMetricCard
                title="Lives Saved"
                value={impactLoading ? "..." : impactError ? "Error" : impactStats?.livesSaved?.toFixed(1) ?? "0.0"}
                change="+2.1"
                changeType="increase"
                description="Based on effectiveness research"
                color="green"
              />
              <ImpactMetricCard
                title="QUALYs Gained"
                value={impactLoading ? "..." : impactError ? "Error" : impactStats?.qualysGained?.toFixed(1) ?? "0.0"}
                change="+8.2"
                changeType="increase"
                description="Quality-adjusted life years"
                color="blue"
              />
              <ImpactMetricCard
                title="People Helped"
                value={impactLoading ? "..." : impactError ? "Error" : impactStats?.peopleImpacted ? Math.round(impactStats.peopleImpacted).toLocaleString() : "0"}
                change="+247"
                changeType="increase"
                description="Individuals positively impacted"
                color="blue"
              />
              <ImpactMetricCard
                title="Total Donated"
                value={impactLoading ? "..." : impactError ? "Error" : `$${impactStats?.totalDonated?.toLocaleString() ?? "0"}`}
                change="+$2,400"
                changeType="increase"
                description={impactError ? "Unable to load" : `${impactStats?.donationCount ?? 0} donations • ${impactStats?.confidenceLevel ? impactStats.confidenceLevel + ' confidence' : 'Based on research'}`}
                color="orange"
              />
            </div>

            {/* Gamification Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressTracker />
              <AchievementsBadges />
            </div>

            {/* Content based on current view */}
            {currentView === 'qualitative' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Your Impact Stories</h2>
                  <p className="text-muted-foreground">
                    See how your donations are making a real difference in communities around the world.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {storiesLoading ? (
                    <div className="col-span-full text-center text-muted-foreground">
                      Loading stories...
                    </div>
                  ) : (
                    stories.map((story, index) => (
                      <StoryCard key={index} {...story} />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Impact Analytics</h2>
                  <p className="text-muted-foreground">
                    Track your charitable impact with data-driven insights and research-based estimates.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ImpactChart
                    title="Donation Trends"
                    data={chartLoading ? [] : donationTrends}
                    type="bar"
                    color="hsl(var(--chart-3))"
                  />
                  <ImpactChart
                    title="Lives Saved Over Time"
                    data={chartLoading ? [] : impactTrends}
                    type="line"
                    color="hsl(var(--chart-1))"
                  />
                  <ImpactChart
                    title="Category Distribution"
                    data={chartLoading ? [] : categoryBreakdown}
                    type="bar"
                    color="hsl(var(--chart-4))"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}