import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Globe, TrendingUp, Target, Lightbulb } from "lucide-react";

export default function OurMission() {
  return (
    <div className="space-y-8">
      {/* Mission Statement Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-chart-1/10 p-4 rounded-full">
            <Heart className="h-12 w-12 text-chart-1" />
          </div>
        </div>
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          To transform charitable giving into a transparent, measurable, and engaging experience that maximizes positive impact in the world.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-2/10 p-3 rounded-lg">
                <Target className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle className="text-lg">Transparency</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe donors deserve to know exactly how their contributions make a difference. Every estimate is backed by research and clearly explained.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle className="text-lg">Evidence-Based Impact</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our impact calculations are grounded in rigorous research from organizations like GiveWell, enabling data-driven giving decisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-1/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle className="text-lg">Human Connection</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Behind every statistic are real people. We share stories from communities your donations help to create meaningful connections.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-4/10 p-3 rounded-lg">
                <Lightbulb className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle className="text-lg">Continuous Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The field of impact measurement evolves constantly. We update our methodologies as new research emerges to improve accuracy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-5/10 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-chart-5" />
              </div>
              <CardTitle className="text-lg">Global Perspective</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We focus on the most pressing global challenges where additional funding can have the greatest marginal impact on human welfare.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-chart-2/10 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle className="text-lg">Respectful Engagement</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We approach charitable giving with humility, respecting the dignity of those we aim to help and the complexity of global challenges.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What We're Building Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What We're Building</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Traditional charitable giving often feels like a black box. You donate money and receive a thank-you note, 
            but rarely understand the concrete impact of your contribution. We're changing that by creating a platform 
            that makes impact visible, measurable, and meaningful.
          </p>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Our Impact Platform Provides:</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="bg-chart-1/10 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                </div>
                <span><strong>Real-time impact tracking</strong> - See how many lives you've helped save, QUALYs gained, and people positively impacted</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-chart-2/10 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                </div>
                <span><strong>Confidence indicators</strong> - Understand the certainty level of our impact estimates based on research quality</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-chart-3/10 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                </div>
                <span><strong>Personal stories</strong> - Connect with communities your donations support through authentic narratives</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-chart-4/10 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                </div>
                <span><strong>Progress visualization</strong> - Track your charitable journey with meaningful metrics, not arbitrary points</span>
              </li>
            </ul>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            We believe that when people can see the tangible difference their generosity makes, it inspires continued 
            giving and helps create a more compassionate world. Every donation becomes part of a larger story of positive change.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}