
import { ComplianceCheck } from "@/types/compliance";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShieldAlert } from "lucide-react";

interface ComplianceChecksTableProps {
  checks: ComplianceCheck[];
}

export function ComplianceChecksTable({ checks }: ComplianceChecksTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Passed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Failed</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Warning</Badge>;
      case 'exempted':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700">Exempted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-amber-500 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resource</TableHead>
          <TableHead>Policy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Issues</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checks.map((check) => (
          <TableRow key={check.id}>
            <TableCell>
              <div className="font-medium">{check.resource_type}</div>
              <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                {check.resource_id}
              </div>
            </TableCell>
            <TableCell>{check.policy_name || 'Unknown Policy'}</TableCell>
            <TableCell>{getStatusBadge(check.status)}</TableCell>
            <TableCell>{check.severity && getSeverityBadge(check.severity)}</TableCell>
            <TableCell>{formatDate(check.checked_at)}</TableCell>
            <TableCell>
              {check.issues && check.issues.length > 0 ? (
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  {check.issues.length} {check.issues.length === 1 ? 'issue' : 'issues'}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700">No issues</Badge>
              )}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
