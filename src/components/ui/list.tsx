
import React from "react";
import { cn } from "@/lib/utils";

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  children: React.ReactNode;
}

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  children: React.ReactNode;
}

export function List({ children, className, ...props }: ListProps) {
  return (
    <ul className={cn("list-disc space-y-2", className)} {...props}>
      {children}
    </ul>
  );
}

export function ListItem({ children, className, ...props }: ListItemProps) {
  return (
    <li className={cn("ml-4", className)} {...props}>
      {children}
    </li>
  );
}
