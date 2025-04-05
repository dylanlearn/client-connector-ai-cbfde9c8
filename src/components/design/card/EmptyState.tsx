
interface EmptyStateProps {
  category: string;
}

const EmptyState = ({ category }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted">
      <p className="text-lg text-muted-foreground">No {category} options available</p>
    </div>
  );
};

export default EmptyState;
