import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, BarChart3, Users, TrendingUp, Award, Target, Shield, Eye, Zap, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-chart-1" />
              <h1 className="text-xl font-semibold">Impact Altruism</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-6">
            See the Real Impact of Your Charitable Giving
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your donations into measurable impact with research-based estimates, 
            engaging progress tracking, and personal stories from the communities you're helping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="text-lg px-8 py-3"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-3"
              data-testid="button-learn-more"
            >
              Learn How It Works
            </Button>
          </div>
        </div>

        {/* Impact Demo Section */}
        <div className="mt-20" id="how-it-works">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How Impact Estimation Works</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We use research-based effectiveness data to estimate the real-world impact of your charitable donations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="p-6" data-testid="demo-impact-card">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-chart-1">Your $100 Donation</div>
                  <div className="text-muted-foreground">to Against Malaria Foundation</div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-chart-2">0.3</div>
                      <div className="text-sm text-muted-foreground">Lives Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-chart-3">12.5</div>
                      <div className="text-sm text-muted-foreground">QUALYs Gained</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-chart-1">167</div>
                      <div className="text-sm text-muted-foreground">People Helped</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">High Confidence</Badge>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-chart-2/10 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Research-Based Estimates</h4>
                  <p className="text-muted-foreground">
                    Impact calculations use effectiveness data from GiveWell, academic research, 
                    and charity evaluations to provide realistic estimates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-chart-1/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Confidence Levels</h4>
                  <p className="text-muted-foreground">
                    Each estimate includes a confidence rating (High/Medium/Low) based on 
                    the quality of available evidence and research.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-chart-3/10 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Full Transparency</h4>
                  <p className="text-muted-foreground">
                    All methodologies, assumptions, and data sources are openly available 
                    so you can understand exactly how estimates are calculated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Engage with Your Impact</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress, unlock achievements, and stay motivated with gamified giving.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="feature-progress-tracking">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Level up as you donate! Earn experience points, maintain giving streaks, 
                  and reach donation milestones.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Level 3 Donor</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">25 XP to Level 4</p>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="feature-achievement-badges">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-chart-1" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Unlock beautiful badges for donation milestones, giving streaks, 
                  and impact achievements.
                </p>
                <div className="flex gap-2">
                  <div className="bg-red-100 text-red-800 border border-red-200 rounded p-2">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 rounded p-2">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="bg-blue-100 text-blue-800 border border-blue-200 rounded p-2">
                    <Target className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="feature-personal-stories">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-chart-3" />
                  Personal Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Read inspiring stories from communities your donations have helped, 
                  connecting the human side of your charitable impact.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-impact-analytics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-chart-2" />
                  Impact Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track lives saved, QUALYs gained, and people helped with interactive 
                  charts and research-based effectiveness metrics.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-confidence-meters">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-chart-1" />
                  Confidence Meters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See exactly how certain we are about each impact estimate with 
                  transparent confidence levels based on research quality.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-charity-coverage">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-chart-3" />
                  Wide Charity Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Support for major effective charities with research-backed estimates 
                  and proxy calculations for organizations without direct data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 py-16 bg-muted/30 rounded-2xl">
          <h3 className="text-3xl font-bold mb-4">Ready to See Your Impact?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Impact Altruism and transform your charitable giving into measurable, meaningful change.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="text-lg px-8 py-3"
            data-testid="button-cta-signup"
          >
            Start Tracking Your Impact
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free to use • Research-based estimates • Full transparency
          </p>
        </div>
      </div>
    </div>
  );
}