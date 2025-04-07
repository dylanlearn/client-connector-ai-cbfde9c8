
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface QueryData {
  query: string;
  calls: number;
  totalExecTime: number; // Changed to camelCase for consistency
  meanExecTime: number; // Changed to camelCase for consistency
}

interface ProfileQueryTableProps {
  queries: QueryData[];
  timestamp: string;
}

const ProfileQueryTable: React.FC<ProfileQueryTableProps> = ({ queries, timestamp }) => {
  const [sortField, setSortField] = useState<keyof QueryData>("totalExecTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof QueryData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedQueries = [...queries].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Format time values
  const formatTime = (ms: number): string => {
    if (ms < 1) {
      return `${(ms * 1000).toFixed(2)}μs`;
    } else if (ms < 1000) {
      return `${ms.toFixed(2)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Last updated: {formatDistanceToNow(new Date(timestamp))} ago
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Query</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("calls")}
              >
                Calls
                {sortField === "calls" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("totalExecTime")}
              >
                Total Time
                {sortField === "totalExecTime" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("meanExecTime")}
              >
                Avg Time
                {sortField === "meanExecTime" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQueries.map((query, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">
                  {query.query}
                </TableCell>
                <TableCell>{query.calls.toLocaleString()}</TableCell>
                <TableCell>{formatTime(query.totalExecTime)}</TableCell>
                <TableCell>{formatTime(query.meanExecTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProfileQueryTable;
