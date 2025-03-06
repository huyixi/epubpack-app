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
import type { File } from "./data";

export function DragHandleCell() {
  return (
    <div className="flex items-center justify-center">
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: File["status"] }) {
  const statusMap: Record<
    File["status"],
    {
      icon: React.ReactNode;
    }
  > = {
    "in-progress": {
      icon: <LoaderCircle className="h-4 w-4 mr-1 animate-spin" />,
    },
    done: {
      icon: <CircleCheck className="h-4 w-4 mr-1" />,
    },
    failed: { icon: <FileWarning className="h-4 w-4 mr-1" /> },
  };

  const { icon } = statusMap[status];

  return <>{icon}</>;
}

export const columns = (onDelete: (id: string) => void): ColumnDef<File>[] => [
  {
    id: "drag-handle",
    cell: () => <DragHandleCell />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const file = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-destructive"
          onClick={() => onDelete(file.id)}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Delete file</span>
        </Button>
      );
    },
  },
];
