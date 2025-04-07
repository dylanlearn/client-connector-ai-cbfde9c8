
interface VisualElementsProps {
  elements: {
    layout: string;
    colorScheme: string;
    typography: string;
    imagery?: string;
  };
}

export default function VisualElements({ elements }: VisualElementsProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Visual Elements</h3>
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Layout:</span> {elements.layout}</p>
        <p><span className="font-medium">Color Scheme:</span> {elements.colorScheme}</p>
        <p><span className="font-medium">Typography:</span> {elements.typography}</p>
        <p><span className="font-medium">Imagery:</span> {elements.imagery || 'Not specified'}</p>
      </div>
    </div>
  );
}
