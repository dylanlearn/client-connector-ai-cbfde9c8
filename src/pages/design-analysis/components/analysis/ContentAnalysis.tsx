
interface ContentAnalysisProps {
  content: {
    tone: string;
    messaging: string;
    callToAction: string;
  };
}

export default function ContentAnalysis({ content }: ContentAnalysisProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Content Analysis</h3>
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Tone:</span> {content.tone}</p>
        <p><span className="font-medium">Messaging:</span> {content.messaging}</p>
        <p><span className="font-medium">Call to Action:</span> {content.callToAction}</p>
      </div>
    </div>
  );
}
