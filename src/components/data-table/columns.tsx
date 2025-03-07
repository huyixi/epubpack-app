"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  GripVertical,
  X,
  LoaderCircle,
  FileWarning,
  CircleCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { FileData, FileStatus } from "./data";
import { FileStatusIcon } from "./status-icon";

export function DragHandleCell() {
  return (
    <div className="flex items-center justify-center">
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

export const createColumns = (
  onDelete: (id: string) => void,
): ColumnDef<FileData>[] => [
  {
    id: "drag-handle",
    cell: () => <DragHandleCell />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <FileStatusIcon status={row.getValue<FileStatus>("status")} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-destructive"
        onClick={() => onDelete(row.original.id)}
      >
        <X className="w-4 h-4" />
        <span className="sr-only">Delete file</span>
      </Button>
    ),
  },
];
