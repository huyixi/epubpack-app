"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, GripVertical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      label: string;
      variant: "outline" | "secondary" | "destructive" | "default";
    }
  > = {
    "in-progress": { label: "In Progress", variant: "secondary" },
    done: { label: "Done", variant: "default" },
    failed: { label: "Failed", variant: "destructive" },
  };

  const { label, variant } = statusMap[status];

  return <Badge variant={variant}>{label}</Badge>;
}

export const columns: ColumnDef<File>[] = [
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
      const File = row.original;
      return (
        <Button variant="ghost">
          <X />
        </Button>
      );
    },
  },
];
