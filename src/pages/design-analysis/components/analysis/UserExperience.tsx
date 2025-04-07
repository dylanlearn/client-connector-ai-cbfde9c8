
interface UserExperienceProps {
  experience: {
    navigation: string;
    interactivity: string;
    responsiveness: string;
    accessibility: string;
  };
}

export default function UserExperience({ experience }: UserExperienceProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">User Experience</h3>
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Navigation:</span> {experience.navigation}</p>
        <p><span className="font-medium">Interactivity:</span> {experience.interactivity}</p>
        <p><span className="font-medium">Responsiveness:</span> {experience.responsiveness}</p>
        <p><span className="font-medium">Accessibility:</span> {experience.accessibility}</p>
      </div>
    </div>
  );
}
