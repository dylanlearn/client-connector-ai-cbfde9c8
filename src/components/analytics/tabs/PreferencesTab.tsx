
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPreference } from "@/types/analytics";

interface PreferencesTabProps {
  userPreferences: UserPreference[] | undefined;
  isLoading: boolean;
}

const PreferencesTab = ({ userPreferences, isLoading }: PreferencesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Design Preferences</CardTitle>
        <CardDescription>
          Your rankings and selections from all intakes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : userPreferences && userPreferences.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Design</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPreferences.map((pref) => (
                <TableRow key={pref.id}>
                  <TableCell className="font-medium">{pref.title}</TableCell>
                  <TableCell className="capitalize">{pref.category}</TableCell>
                  <TableCell>
                    {pref.rank ? (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                        <span>{pref.rank}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not ranked</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {pref.notes || <span className="text-muted-foreground">No notes</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(pref.updated_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6">
            <Star className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No Preferences Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              You haven't selected any design preferences yet. Go to the Design Picker
              to start selecting and ranking your favorite designs.
            </p>
            <Button>Go to Design Picker</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
