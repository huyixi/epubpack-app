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
import { Settings } from "lucide-react";
import { ConfigDialog } from "@/components/config-dialog";

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

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };

      reader.onerror = () => {
        reject(new Error(`Error reading file: ${file.name}`));
      };

      reader.readAsText(file);
    });
  };

  const processFile = useCallback(async (fileId: string, file: File) => {
    // 更新状态为处理中
    setTableData((prev) =>
      prev.map((item) =>
        item.id === fileId
          ? { ...item, status: "processing" as FileStatus }
          : item,
      ),
    );

    try {
      // 实际读取文件内容
      const content = await readFileContent(file);

      // 读取成功，更新状态和内容
      setTableData((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? {
                ...item,
                status: "done" as FileStatus,
                content: content,
              }
            : item,
        ),
      );

      return true;
    } catch (error) {
      console.error("Error processing file:", error);

      // 读取失败，更新状态
      setTableData((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? { ...item, status: "failed" as FileStatus }
            : item,
        ),
      );

      toast.error(`Failed to read file: ${file.name}`);
      return false;
    }
  }, []);

  const handleAddFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileData[] = Array.from(fileList).map((file) => {
        const id = uuidv4();
        // 存储文件引用
        filesRef.current.set(id, file);

        return {
          id,
          title: file.name,
          status: "processing" as FileStatus,
          file,
        };
      });

      setTableData((prevData) => [...prevData, ...newFiles]);

      // 为每个新文件模拟处理流程
      newFiles.forEach(async (newFile) => {
        const file = filesRef.current.get(newFile.id);
        if (file) {
          await processFile(newFile.id, file);
        }
      });
    },
    [processFile],
  );

  const generateTextFile = (files: FileData[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // 按表格中的顺序合并所有文件内容
        let combinedContent = "";

        files.forEach((file, index) => {
          // 添加文件标题作为章节标题
          combinedContent += `\n\n--- ${file.title} ---\n\n`;

          // 添加文件内容
          if (file.content) {
            combinedContent += file.content;
          } else {
            combinedContent += "[No content available]";
          }

          // 在文件之间添加分隔符（最后一个文件除外）
          if (index < files.length - 1) {
            combinedContent += "\n\n";
          }
        });

        // 从合并的内容创建一个blob
        const blob = new Blob([combinedContent], { type: "text/plain" });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "combined_output.txt";

        // 将链接添加到body，点击它，然后移除
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放URL对象
        URL.revokeObjectURL(url);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

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
      await generateTextFile(tableData);

      setIsGenerating(false);

      toast.success("Success", {
        description: "Your text file has been generated and downloaded!",
      });
    } catch (error) {
      console.error("Error generating output:", error);
      setIsGenerating(false);
      toast.error("Failed to generate text file", {
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
