import { useState, useCallback } from "react";

import { useDropzone } from "react-dropzone";
import { FileIcon, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { ConfigDialog } from "@/components/config-dialog";

const initialFiles: FileData[] = [];
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
export function DataTable() {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Supported file types for EPUB generation
  const acceptedFileTypes = {
    "text/markdown": [".md", ".markdown"],
    "text/html": [".html", ".htm"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  };

  const handleFileUpload = (newFiles: File[]) => {
    setIsUploading(true);

    try {
      // Validate file types
      const invalidFiles = newFiles.filter((file) => {
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        return !Object.values(acceptedFileTypes).flat().includes(fileExtension);
      });

      if (invalidFiles.length > 0) {
        toast.error("Invalid file types", {
          description: `${invalidFiles.map((f) => f.name).join(", ")} are not supported.`,
        });
      }

      // Process valid files
      const validFiles = newFiles.filter((file) => {
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        return Object.values(acceptedFileTypes).flat().includes(fileExtension);
      });

      // Simulate processing time
      setTimeout(() => {
        const newFileEntries = validFiles.map((file) => ({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          type: file.type,
        }));

        setFiles((prev) => [...prev, ...newFileEntries]);
        setIsUploading(false);

        if (validFiles.length > 0) {
          toast.success("Files uploaded successfully", {
            description: `${validFiles.length} file(s) have been uploaded.`,
          });
        }
      }, 1500);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Upload failed", {
        description: "There was an error processing your files.",
      });
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    noClick: true,
  });

  const removeFile = (id: string) => {
    console.log("removeFile", id);
    setFiles((prev) => prev.filter((file) => file.id !== id));
    toast.success("File removed", {
      description: "The file has been removed from the list.",
    });
  };

  const handleAddFileClick = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    // Set accepted file types
    const acceptValues = Object.values(acceptedFileTypes).flat().join(",");
    input.accept = acceptValues;

    // Handle file selection
    input.onchange = (e) => {
      const selectedFiles = Array.from(
        (e.target as HTMLInputElement).files || [],
      );
      if (selectedFiles.length > 0) {
        handleFileUpload(selectedFiles);
      }
    };

    // Trigger the file selection dialog
    input.click();
  };

  const handleGenerateEpub = () => {
    if (files.length === 0) {
      toast.error("No files to process", {
        description: "Please add at least one file to generate an EPUB.",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate EPUB generation process
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("EPUB generated successfully", {
        description: "Your EPUB file is ready for download.",
      });
      // Here you would typically trigger a download or show a download link
    }, 2000);
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
                    onClick={handleAddFileClick}
                  >
                    <FileIcon className="w-8 h-8" />
                    <p>Drop files here or click to upload</p>
                    <p className="text-sm">
                      Supported files: Markdown, HTML, PDF, DOC, DOCX
                    </p>
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
                      className="hover:text-destructive bg-red-600"
                    >
                      {/* <X className="w-4 h-4" /> */}
                      <Plus className="w-4 h-4" />
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
          )}
        </Table>
      </div>
      <div className="w-full flex justify-end items-center mt-4 gap-2">
        <Button
          onClick={handleGenerateEpub}
          disabled={isGenerating || files.length === 0}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate EPUB"
          )}
        </Button>
        <ConfigDialog />
      </div>
    </div>
  );
}
