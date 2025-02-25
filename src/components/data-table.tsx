"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileIcon, Loader2, Trash2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
}

// Sample initial data
const initialFiles: FileData[] = [
  // {
  //   id: "1",
  //   name: "document.pdf",
  //   size: 1024576,
  //   type: "application/pdf",
  // },
  // {
  //   id: "2",
  //   name: "spreadsheet.md",
  //   size: 2048576,
  //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // },
];

export function DataTable() {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);

    // Simulate upload delay - replace with your actual upload logic
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
          rounded-md border relative h-[80%]
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
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full min-h-[400px]">
                    <FileIcon className="w-8 h-8" />
                    <p>Drop files here to upload</p>
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
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete file</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-end items-center mt-4 gap-2">
        <Button>Generate EPUB</Button>
        <Button variant="secondary">
          <SlidersHorizontal />
        </Button>
      </div>
    </div>
  );
}
