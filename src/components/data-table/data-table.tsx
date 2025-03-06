"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileIcon, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfigDialog } from "@/components/config-dialog";
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

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
}

const initialFiles: FileData[] = [];

interface DraggableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Draggable row component
function DraggableTableRow<TData>({
  row,
}: {
  row: Row<TData>;
  reorderRow: (draggedRowId: string, targetRowId: string) => void;
}) {
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
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={isDragging ? "bg-muted" : ""}
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
    </TableRow>
  );
}

export function DraggableDataTable<TData, TValue>({
  columns,
  data: initialData,
}: DraggableDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TData[]>(initialData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeRow, setActiveRow] = useState<Row<TData> | null>(null);

  // Update data if initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

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

    // Find the active row
    const rowIndex = data.findIndex((item: any) => item.id === active.id);
    if (rowIndex !== -1) {
      const row = table.getRowModel().rows[rowIndex];
      setActiveRow(row);
    }
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((items) => {
        // Find the indices of the items
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);

        // Return the reordered array
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
    setActiveRow(null);
  };

  // Function to reorder rows (used by DraggableTableRow)
  const reorderRow = (draggedRowId: string, targetRowId: string) => {
    setData((items) => {
      const oldIndex = items.findIndex((item: any) => item.id === draggedRowId);
      const newIndex = items.findIndex((item: any) => item.id === targetRowId);
      return arrayMove(items, oldIndex, newIndex);
    });
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
                      <DraggableTableRow
                        key={row.id}
                        row={row}
                        reorderRow={reorderRow}
                      />
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

export function DataTable() {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);

    setTimeout(() => {
      const newFiles = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      setIsUploading(false);

      toast.success("Files uploaded successfully", {
        description: `${acceptedFiles.length} file(s) have been uploaded.`,
      });
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/html": [".html", ".htm"],
    },
    noClick: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    toast.success("File removed", {
      description: "The file has been removed from the list.",
    });
  };

  return (
    <div className="w-full h-screen mx-auto">
      <div
        {...getRootProps()}
        className={`
          rounded-md border relative
          ${isDragActive ? "ring-2 ring-primary" : ""}
        `}
      >
        <input {...getInputProps()} />

        {/* Drag overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
            <div className="text-lg font-medium text-primary">
              Drop files here to upload...
            </div>
          </div>
        )}

        {/* Upload indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading files...</span>
            </div>
          </div>
        )}

        <Table className="h-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full">
            {files.length === 0 ? (
              <TableRow className="h-full flex-1">
                <TableCell colSpan={5} className="h-full text-center">
                  <div
                    className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full min-h-[400px] cursor-pointer hover:bg-gray-50 transition-colors "
                    onClick={() => {
                      // Create an input element
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".md,.markdown,.html,.htm";
                      input.multiple = true;

                      input.onchange = (e) => {
                        const files = Array.from(
                          (e.target as HTMLInputElement).files || [],
                        );
                      };

                      input.click();
                    }}
                  >
                    <FileIcon className="w-8 h-8" />
                    <p>Drop files here or click to upload</p>
                    <p className="text-sm">Supported files: Markdown, HTML</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      className="hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Delete file</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {files.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="flex items-center gap-4 bg-transparent cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <p>Add File</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      <div className="w-full flex justify-end items-center mt-4 gap-2">
        <Button>Generate EPUB</Button>
        <ConfigDialog />
      </div>
    </div>
  );
}
