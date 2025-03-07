"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, GripVertical, Wind, X } from "lucide-react";

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
    size: 50,
    meta: {
      width: "50px",
    },
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
    cell: ({ row }) => {
      const title = row.getValue<string>("title");
      return (
        <div className="max-w-[400px] truncate" title={title}>
          {title}
        </div>
      );
    },
    size: 9999,
    meta: {
      width: "auto",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <FileStatusIcon status={row.getValue<FileStatus>("status")} />
    ),
    size: 100,
    meta: {
      width: "100px",
    },
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
    size: 60,
    meta: {
      width: "60px",
    },
  },
];
