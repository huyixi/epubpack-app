import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { DataTable } from "@/components/data-table";
import { createColumns } from "@/components/data-table/columns";
import {
  initialFiles,
  FileData,
  FileStatus,
} from "@/components/data-table/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings, CheckCircleIcon, CircleAlert } from "lucide-react";
import { ConfigDialog } from "@/components/config-dialog";

import { readFileContent } from "@/utils/fileUtils";
import { generateEpub } from "@/utils/ebookUtils";

const App = () => {
  const [tableData, setTableData] = useState<FileData[]>(initialFiles);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const filesRef = useRef<Map<string, File>>(new Map());

  const handleReorder = useCallback((newData: FileData[]) => {
    setTableData(newData);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTableData((currentData) => currentData.filter((file) => file.id !== id));
    filesRef.current.delete(id);
  }, []);

  const updateFileStatus = useCallback(
    (fileId: string, status: FileStatus, additionalProps = {}) => {
      setTableData((prev) =>
        prev.map((item) =>
          item.id === fileId ? { ...item, status, ...additionalProps } : item,
        ),
      );
    },
    [],
  );

  const processFile = useCallback(
    async (fileId: string, file: File) => {
      updateFileStatus(fileId, "processing");

      try {
        const content = await readFileContent(file);
        updateFileStatus(fileId, "done", { content });
        return true;
      } catch (error) {
        console.error("Error processing file:", error);
        updateFileStatus(fileId, "failed");
        toast.error(`Failed to read file: ${file.name}`);
        return false;
      }
    },
    [updateFileStatus],
  );

  const handleAddFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileData[] = Array.from(fileList).map((file) => {
        const id = uuidv4();
        filesRef.current.set(id, file);

        return {
          id,
          title: file.name,
          status: "processing" as FileStatus,
          file,
        };
      });

      setTableData((prevData) => [...prevData, ...newFiles]);

      Promise.all(
        newFiles.map((newFile) => {
          const file = filesRef.current.get(newFile.id);
          return file ? processFile(newFile.id, file) : Promise.resolve(false);
        }),
      ).catch((error) => {
        console.error("Error processing files batch:", error);
      });
    },
    [processFile],
  );

  const handleGenerate = useCallback(async () => {
    if (tableData.length === 0) {
      toast.error("No files to generate ebook");
      return;
    }

    toast("Generating ebook", {
      description: "Your ebook is being generated...",
    });

    setIsGenerating(true);

    try {
      await generateEpub(tableData);

      setIsGenerating(false);

      toast.success("File exported successfully", {
        icon: <CheckCircleIcon className="h-5 w-5 text-emerald-500" />,
        duration: 10000,
      });
    } catch (error) {
      console.error("Error generating output:", error);
      setIsGenerating(false);
      toast.error("Failed to generate EPUB file", {
        icon: <CircleAlert className="h-5 w-5 text-red-500" />,
        description: "An error occurred while combining file contents.",
      });
    }
  }, [tableData]);

  const columns = createColumns(handleDelete);

  return (
    <main className="flex flex-col h-screen w-screen p-4">
      <h1 className="text-2xl font-bold mb-4">EPUB Pack</h1>
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={tableData}
          onReorder={handleReorder}
          onAddFiles={handleAddFiles}
          onGenerate={handleGenerate}
        />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsConfigOpen(true)}
        >
          <Settings />
        </Button>
        <Button
          variant="default"
          className="flex-1"
          disabled={tableData.length === 0 || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? "Generating..." : "Generate Ebook"}
        </Button>
      </div>
      <ConfigDialog open={isConfigOpen} onOpenChange={setIsConfigOpen} />
    </main>
  );
};

export default App;
