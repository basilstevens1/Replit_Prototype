import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

interface StoryCardProps {
  title: string;
  organization: string;
  location: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  impact: string;
}

export default function StoryCard({ 
  title, 
  organization, 
  location, 
  date, 
  excerpt, 
  imageUrl, 
  impact 
}: StoryCardProps) {
  return (
    <Card className="hover-elevate overflow-hidden" data-testid={`card-story-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          data-testid="img-story-thumbnail"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2 text-sm" data-testid="text-story-title">
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {impact}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid="text-story-excerpt">
          {excerpt}
        </p>
        <p className="text-xs text-primary font-medium mt-2">
          {organization}
        </p>
      </CardContent>
    </Card>
  );
}