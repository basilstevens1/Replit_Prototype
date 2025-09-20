import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, BarChart3, Bookmark } from "lucide-react";

interface HeaderProps {
  currentView: 'qualitative' | 'quantitative';
  onViewChange: (view: 'qualitative' | 'quantitative') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-chart-1" />
              <h1 className="text-xl font-semibold">Impact Altruism</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-muted p-1">
              <Button
                variant={currentView === 'qualitative' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('qualitative')}
                className="flex items-center gap-2"
                data-testid="button-qualitative-view"
              >
                <Bookmark className="h-4 w-4" />
                Stories
              </Button>
              <Button
                variant={currentView === 'quantitative' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('quantitative')}
                className="flex items-center gap-2"
                data-testid="button-quantitative-view"
              >
                <BarChart3 className="h-4 w-4" />
                Metrics
              </Button>
            </div>
            
            <Button variant="outline" size="sm" data-testid="button-profile">
              JD
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}