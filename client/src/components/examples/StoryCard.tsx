import StoryCard from '../StoryCard';
import waterStoryImage from '@assets/generated_images/Clean_water_project_story_573328ad.png';
import educationStoryImage from '@assets/generated_images/Education_program_story_cf00d503.png';
import healthStoryImage from '@assets/generated_images/Healthcare_access_story_923d8707.png';

export default function StoryCardExample() {
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
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {mockStories.map((story, index) => (
        <StoryCard key={index} {...story} />
      ))}
    </div>
  );
}