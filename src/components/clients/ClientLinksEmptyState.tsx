
import { FileX } from "lucide-react";

export default function ClientLinksEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
      <div className="bg-muted rounded-full p-3 mb-4">
        <FileX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No links found</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        There are no client links in this category. Create a new client link to get started.
      </p>
    </div>
  );
}
