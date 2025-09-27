import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BarChart3, Users, TrendingUp } from "lucide-react";

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
            Track Your Charitable Impact
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            See the real-world difference your donations make with quantitative metrics 
            and personal stories from the communities you're helping.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="text-lg px-8 py-3"
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chart-2" />
                Quantitative Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track lives saved, QUALYs gained, and other research-based metrics 
                showing the effectiveness of your donations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-chart-1" />
                Personal Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Read inspiring stories from communities and individuals whose 
                lives have been directly improved by your charitable giving.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-3" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor your giving over time with detailed analytics and 
                insights to maximize your charitable impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}