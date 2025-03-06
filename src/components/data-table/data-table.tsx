"use client";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  type Row,
} from "@tanstack/react-table";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onReorder?: (newData: TData[]) => void;
}

// Draggable row component
function DraggableTableRow<TData>({ row }: { row: Row<TData> }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: (row.original as any).id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? "relative" : "static",
    zIndex: isDragging ? 1 : 0,
  } as React.CSSProperties;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={`${isDragging ? "bg-muted" : ""} border-b transition-colors hover:bg-muted/50`}
      {...attributes}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag-handle" ? (
            <div {...listeners} className="cursor-grab active:cursor-grabbing">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </tr>
  );
}

export function DraggableDataTable<TData, TValue>({
  columns,
  data,
  onReorder,
}: DraggableDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeRow, setActiveRow] = useState<Row<TData> | null>(null);

  // Configure dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the active row by ID directly from table rows
    const row = table
      .getRowModel()
      .rows.find((r) => (r.original as any).id === active.id);

    if (row) {
      setActiveRow(row);
    }
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the indices of the items
      const oldIndex = data.findIndex((item: any) => item.id === active.id);
      const newIndex = data.findIndex((item: any) => item.id === over.id);

      // Reorder the array
      const reorderedData = arrayMove([...data], oldIndex, newIndex);

      // Notify parent component about the change if callback exists
      if (onReorder) {
        onReorder(reorderedData);
      }
    }

    setActiveId(null);
    setActiveRow(null);
  };

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Get row IDs for SortableContext
  const rowIds = data.map((item: any) => item.id);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <SortableContext
                items={rowIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <DraggableTableRow key={row.id} row={row} />
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>

          {/* Drag overlay for visual feedback */}
          <DragOverlay>
            {activeId && activeRow ? (
              <Table>
                <TableBody>
                  <TableRow className="bg-muted/50 border shadow-md">
                    {activeRow.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
