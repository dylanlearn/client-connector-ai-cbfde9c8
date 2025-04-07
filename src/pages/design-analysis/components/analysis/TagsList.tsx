
interface TagsListProps {
  tags: string[];
}

export default function TagsList({ tags }: TagsListProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
