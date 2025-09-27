import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, BarChart3, Bookmark, LogOut, Target, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  currentView: 'qualitative' | 'quantitative' | 'mission' | 'approach';
  onViewChange: (view: 'qualitative' | 'quantitative' | 'mission' | 'approach') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { user } = useAuth();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

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
              <Button
                variant={currentView === 'mission' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('mission')}
                className="flex items-center gap-2"
                data-testid="button-mission-view"
              >
                <Target className="h-4 w-4" />
                Our Mission
              </Button>
              <Button
                variant={currentView === 'approach' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('approach')}
                className="flex items-center gap-2"
                data-testid="button-approach-view"
              >
                <BookOpen className="h-4 w-4" />
                Our Approach
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                    <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}