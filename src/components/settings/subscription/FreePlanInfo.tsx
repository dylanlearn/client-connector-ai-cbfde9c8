
import { AlertMessage } from "@/components/ui/alert-message";
import { List, ListItem } from "@/components/ui/list";

export function FreePlanInfo() {
  return (
    <AlertMessage type="info" title="Free plan limitations">
      <p className="mb-2">The free plan includes basic features but has the following limitations:</p>
      <List className="ml-2 text-sm">
        <ListItem>Limited to 3 projects</ListItem>
        <ListItem>No advanced A/B testing for content optimization</ListItem>
        <ListItem>Limited AI prompt customization</ListItem>
        <ListItem>Basic analytics only</ListItem>
      </List>
    </AlertMessage>
  );
}
