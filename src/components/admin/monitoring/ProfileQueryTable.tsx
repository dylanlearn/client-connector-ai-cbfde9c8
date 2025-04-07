
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface ProfileQueryTableProps {
  queries: Array<{
    query: string;
    calls: number;
    total_exec_time: number;
    mean_exec_time: number;
  }>;
  timestamp: string;
}

const ProfileQueryTable: React.FC<ProfileQueryTableProps> = ({ queries, timestamp }) => {
  // Format the timestamp for display
  const formattedTimestamp = timestamp 
    ? `Updated ${formatDistanceToNow(new Date(timestamp), { addSuffix: true })}`
    : "Last updated: unknown";
  
  // Format execution time (convert ms to readable format)
  const formatExecTime = (ms: number): string => {
    if (ms < 1) {
      return `${(ms * 1000).toFixed(2)}μs`;
    } else if (ms < 1000) {
      return `${ms.toFixed(2)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };
  
  // Truncate long query strings
  const truncateQuery = (query: string, maxLength: number = 100): string => {
    return query.length > maxLength
      ? `${query.substring(0, maxLength)}...`
      : query;
  };
  
  return (
    <>
      <Table>
        <TableCaption>{formattedTimestamp}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Query</TableHead>
            <TableHead className="text-right">Calls</TableHead>
            <TableHead className="text-right">Total Time</TableHead>
            <TableHead className="text-right">Mean Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-xs">
                {truncateQuery(item.query)}
              </TableCell>
              <TableCell className="text-right">{item.calls.toLocaleString()}</TableCell>
              <TableCell className="text-right">{formatExecTime(item.total_exec_time)}</TableCell>
              <TableCell className="text-right">{formatExecTime(item.mean_exec_time)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProfileQueryTable;
