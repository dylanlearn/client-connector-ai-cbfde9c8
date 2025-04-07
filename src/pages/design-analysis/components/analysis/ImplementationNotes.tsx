
interface ImplementationNotesProps {
  notes: string;
}

export default function ImplementationNotes({ notes }: ImplementationNotesProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Implementation Notes</h3>
      <div className="text-sm space-y-2">
        <p>{notes}</p>
      </div>
    </div>
  );
}
