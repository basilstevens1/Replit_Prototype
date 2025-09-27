import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Search, Calculator, Shield, AlertTriangle, CheckCircle, BarChart3, Users } from "lucide-react";

export default function OurApproach() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-chart-3/10 p-4 rounded-full">
            <BookOpen className="h-12 w-12 text-chart-3" />
          </div>
        </div>
        <h2 className="text-3xl font-bold">Our Approach</h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Our impact estimates combine rigorous research, transparent methodology, and honest assessments of uncertainty to help you understand the real-world effects of your donations.
        </p>
      </div>

      {/* Research Foundation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Search className="h-6 w-6 text-chart-2" />
            Evidence-Based Research Foundation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Our impact calculations are grounded in the best available academic research and analysis from leading 
            organizations in the effective altruism and global development communities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Primary Research Sources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  GiveWell's charity evaluations and cost-effectiveness analyses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Randomized controlled trials (RCTs) from J-PAL and IPA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cochrane systematic reviews and meta-analyses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  WHO and academic public health research
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Supplementary Sources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Charity annual reports and independent evaluations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Academic publications in development economics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Government and NGO monitoring data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Expert opinions from field practitioners
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Calculator className="h-6 w-6 text-chart-1" />
            Impact Calculation Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Core Metrics</h4>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-chart-1/10 p-2 rounded">
                      <Users className="h-4 w-4 text-chart-1" />
                    </div>
                    <h5 className="font-medium">Lives Saved</h5>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculated using mortality reduction rates from intervention studies, adjusted for local context and implementation quality.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Example:</strong> Malaria nets prevent ~0.3 deaths per $100 donated (GiveWell 2024)
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-chart-2/10 p-2 rounded">
                      <BarChart3 className="h-4 w-4 text-chart-2" />
                    </div>
                    <h5 className="font-medium">QUALYs (Quality-Adjusted Life Years)</h5>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Measures both mortality reduction and health improvements, weighted by quality of life factors from health economics research.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Example:</strong> Deworming generates ~12.5 QUALYs per $100 through health and education benefits
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Calculation Process</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-chart-3/10 p-1.5 rounded-full mt-1">
                    <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">1. Base Effectiveness Rate</p>
                    <p className="text-xs text-muted-foreground">Extract cost-per-outcome from research studies</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-chart-4/10 p-1.5 rounded-full mt-1">
                    <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">2. Context Adjustments</p>
                    <p className="text-xs text-muted-foreground">Account for geographic, temporal, and implementation differences</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-chart-5/10 p-1.5 rounded-full mt-1">
                    <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">3. Uncertainty Quantification</p>
                    <p className="text-xs text-muted-foreground">Calculate confidence intervals based on evidence quality</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-chart-1/10 p-1.5 rounded-full mt-1">
                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">4. Final Estimates</p>
                    <p className="text-xs text-muted-foreground">Present point estimates with confidence levels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Shield className="h-6 w-6 text-chart-4" />
            Understanding Confidence Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We assign confidence levels to help you understand the reliability of our impact estimates. 
            This transparency allows you to make informed decisions about where uncertainty matters most to you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Confidence</Badge>
                <Progress value={90} className="flex-1 h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Multiple RCTs,</strong> systematic reviews, and strong theoretical foundation. 
                Estimates likely within ±25% of true value.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Examples: Malaria prevention, deworming programs, cash transfers
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Confidence</Badge>
                <Progress value={60} className="flex-1 h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Some RCTs</strong> or observational studies with good controls. 
                Estimates likely within ±50% of true value.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Examples: Maternal health programs, some education interventions
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Low Confidence</Badge>
                <Progress value={30} className="flex-1 h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Limited studies</strong> or expert estimates based on theory. 
                Estimates may vary significantly from true value.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Examples: Some advocacy work, new or innovative interventions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Where We Use Proxies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-chart-5" />
            When Research Gaps Require Proxies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            In areas where direct research is limited, we use carefully considered proxies and assumptions. 
            We're transparent about these limitations and update estimates as new evidence emerges.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-chart-4 pl-4">
              <h4 className="font-semibold">Common Proxy Situations</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>• Using similar intervention data when direct studies aren't available</li>
                <li>• Extrapolating from related populations or geographic contexts</li>
                <li>• Estimating long-term effects from short-term study results</li>
                <li>• Applying expert judgment for novel or complex interventions</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-chart-2 pl-4">
              <h4 className="font-semibold">Our Commitment</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>• Always flag when proxies are used in calculations</li>
                <li>• Provide lower confidence ratings for proxy-based estimates</li>
                <li>• Update estimates when new direct research becomes available</li>
                <li>• Explain our reasoning and assumptions transparently</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continuous Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Continuous Improvement & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Impact measurement is an evolving field. We regularly review and update our methodology as new research 
            emerges, implementation data becomes available, and measurement techniques improve. Our estimates represent 
            our best current understanding, not definitive truth, and we're committed to ongoing refinement in service 
            of more accurate and useful impact information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}