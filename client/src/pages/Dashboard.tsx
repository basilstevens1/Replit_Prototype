import { useState } from 'react';
import Header from '@/components/Header';
import ImpactMetricCard from '@/components/ImpactMetricCard';
import StoryCard from '@/components/StoryCard';
import ImpactChart from '@/components/ImpactChart';
import TimePeriodSelector from '@/components/TimePeriodSelector';
import DonationForm from '@/components/DonationForm';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import waterStoryImage from '@assets/generated_images/Clean_water_project_story_573328ad.png';
import educationStoryImage from '@assets/generated_images/Education_program_story_cf00d503.png';
import healthStoryImage from '@assets/generated_images/Healthcare_access_story_923d8707.png';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<'qualitative' | 'quantitative'>('qualitative');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [showDonationForm, setShowDonationForm] = useState(false);

  // todo: remove mock functionality
  const mockStories = [
    {
      title: "Clean Water Transforms Village Life in Rural Kenya",
      organization: "charity: water",
      location: "Kakamega, Kenya", 
      date: "Nov 2024",
      excerpt: "Thanks to your donation, the village of Musanda now has access to clean, safe drinking water for the first time. Children no longer walk hours to collect water and can attend school regularly.",
      imageUrl: waterStoryImage,
      impact: "200 lives"
    },
    {
      title: "Girls' Education Program Opens Doors to Future",
      organization: "Malala Fund",
      location: "Chitral, Pakistan",
      date: "Oct 2024", 
      excerpt: "Your support helped build a new classroom and provide school supplies for 45 girls in this remote mountain community. Many are the first in their families to receive formal education.",
      imageUrl: educationStoryImage,
      impact: "45 students"
    },
    {
      title: "Mobile Health Clinic Reaches Remote Communities",
      organization: "Partners In Health",
      location: "Madagascar",
      date: "Sep 2024",
      excerpt: "The mobile clinic funded by your donations has provided essential healthcare to over 300 people in villages that previously had no medical access. Maternal mortality has decreased by 40%.",
      imageUrl: healthStoryImage,
      impact: "300 patients"
    },
    {
      title: "Malaria Prevention Nets Save Lives",
      organization: "Against Malaria Foundation",
      location: "Cameroon",
      date: "Aug 2024",
      excerpt: "Your contribution provided bed nets to 150 families, protecting them from malaria-carrying mosquitoes. Early data shows a 60% reduction in malaria cases in the distribution area.",
      imageUrl: waterStoryImage, // Reusing image for demo
      impact: "150 families"
    }
  ];

  const donationData = [
    { name: 'Jan', value: 500 },
    { name: 'Feb', value: 800 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 900 },
    { name: 'Jun', value: 1500 },
  ];

  const impactData = [
    { name: 'Jan', value: 1.2 },
    { name: 'Feb', value: 2.1 },
    { name: 'Mar', value: 1.8 },
    { name: 'Apr', value: 3.2 },
    { name: 'May', value: 2.7 },
    { name: 'Jun', value: 4.1 },
  ];

  const qualyData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 23 },
    { name: 'Mar', value: 19 },
    { name: 'Apr', value: 35 },
    { name: 'May', value: 28 },
    { name: 'Jun', value: 42 },
  ];

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

            {/* Impact Metrics - Always visible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImpactMetricCard
                title="Lives Saved"
                value="12.3"
                change="+2.1"
                changeType="increase"
                description="Based on GiveWell estimates"
                color="green"
              />
              <ImpactMetricCard
                title="QUALYs Gained"
                value="156.7"
                change="+8.2"
                changeType="increase"
                description="Quality-adjusted life years"
                color="blue"
              />
              <ImpactMetricCard
                title="Total Donated"
                value="$24,580"
                change="+$2,400"
                changeType="increase"
                description="This year"
                color="orange"
              />
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
                  {mockStories.map((story, index) => (
                    <StoryCard key={index} {...story} />
                  ))}
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
                    title="Monthly Donations"
                    data={donationData}
                    type="bar"
                    color="hsl(var(--chart-3))"
                  />
                  <ImpactChart
                    title="Lives Saved Over Time"
                    data={impactData}
                    type="line"
                    color="hsl(var(--chart-1))"
                  />
                  <ImpactChart
                    title="QUALYs Generated"
                    data={qualyData}
                    type="line"
                    color="hsl(var(--chart-2))"
                  />
                  <ImpactChart
                    title="Donation Distribution"
                    data={[
                      { name: 'Health', value: 40 },
                      { name: 'Education', value: 30 },
                      { name: 'Water', value: 20 },
                      { name: 'Other', value: 10 }
                    ]}
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