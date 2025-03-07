"use client";
import { useState, useRef, useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
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
import { Plus } from "lucide-react";

interface DraggableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onReorder?: (newData: TData[]) => void;
  onAddFiles?: (files: FileList) => void;
  onGenerate?: () => void;
}

// Draggable row component
function DraggableTableRow<TData>({ row }: { row: Row<TData> }) {
  const rowId = (row.original as any).id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowId,
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
      className={`${isDragging ? "bg-muted" : ""} border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`}
      {...attributes}
    >
      {row.getVisibleCells().map((cell) => {
        // 获取列的宽度设置
        const width = (cell.column.columnDef.meta as any)?.width;

        return (
          <TableCell
            key={cell.id}
            className="overflow-hidden"
            style={width ? { width } : {}}
          >
            {cell.column.id === "drag-handle" ? (
              <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        );
      })}
    </tr>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onReorder,
  onAddFiles,
}: DraggableDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeRow, setActiveRow] = useState<Row<TData> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const allowedTypes = [".md", ".doc", ".docx", ".txt"];

      const validFiles: File[] = [];
      const invalidFiles: File[] = [];

      Array.from(files).forEach((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        if (allowedTypes.includes(extension)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        toast("Unsupported file types", {
          description: `${invalidFiles.map((f) => f.name).join(", ")}`,
        });
      }

      if (validFiles.length > 0 && onAddFiles) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        onAddFiles(dataTransfer.files);
        toast("Files has been added to the upload queue");
      }

      event.target.value = "";
    },
    [onAddFiles],
  );

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
    getRowId: (row: any) => row.id,
  });

  // Handle drag start event
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id as string);

      const row = table
        .getRowModel()
        .rows.find((r) => (r.original as any).id === active.id);

      if (row) {
        setActiveRow(row);
      }
    },
    [table],
  );

  // Handle drag end event
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = data.findIndex((item: any) => item.id === active.id);
        const newIndex = data.findIndex((item: any) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedData = arrayMove([...data], oldIndex, newIndex);

          if (onReorder) {
            onReorder(reorderedData);
          }
        }
      }

      setActiveId(null);
      setActiveRow(null);
    },
    [data, onReorder],
  );

  // Get row IDs for SortableContext
  const rowIds = data.map((item: any) => item.id);

  return (
    <div className="flex flex-col h-full w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
        accept=".pdf,.doc,.docx,.txt,.md"
      />
      {/* 使用 flex 和响应式尺寸 */}
      <div className="rounded-md border flex-1 w-full overflow-hidden">
        <div className="h-full w-full overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                      >
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
                        No files added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
              <TableFooter className="sticky bottom-0 bg-background z-10">
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div
                      className="flex items-center gap-4 bg-transparent cursor-pointer hover:text-primary transition-colors"
                      onClick={handleAddFileClick}
                    >
                      <Plus className="h-4 w-4" />
                      <p>Add File</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
