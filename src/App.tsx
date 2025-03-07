import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { DraggableDataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import {
  initialFiles,
  FileData,
  FileStatus,
} from "@/components/data-table/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { ConfigDialog } from "./components/ConfigDialog";

const App = () => {
  const [tableData, setTableData] = useState<FileData[]>(initialFiles);
  const [isGeneration, setIsGenerating] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleReorder = useCallback((newData: FileData[]) => {
    setTableData(newData);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTableData((currentData) => currentData.filter((file) => file.id !== id));
  }, []);

  const simulateFileProcessing = useCallback((fileId: string) => {
    // 更新状态为处理中
    setTableData((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, status: "processing" as FileStatus }
          : file,
      ),
    );

    // 模拟处理时间
    const processingTime = 1000 + Math.random() * 3000;

    setTimeout(() => {
      // 90%概率成功，10%概率失败
      const isSuccess = Math.random() > 0.1;

      setTableData((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? { ...file, status: isSuccess ? "done" : ("failed" as FileStatus) }
            : file,
        ),
      );
    }, processingTime);
  }, []);

  const handleAddFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileData[] = Array.from(fileList).map((file) => ({
        id: uuidv4(),
        title: file.name,
        status: "processing" as FileStatus,
      }));

      setTableData((prevData) => [...prevData, ...newFiles]);

      // 为每个新文件模拟处理流程
      newFiles.forEach((newFile) => {
        // 延迟一小段时间后开始处理
        setTimeout(
          () => {
            simulateFileProcessing(newFile.id);
          },
          500 + Math.random() * 1000,
        );
      });
    },
    [simulateFileProcessing],
  );

  const handleGenerate = useCallback(() => {
    // 检查是否有文件
    if (tableData.length === 0) {
      toast.error("No files to generate ebook");
      return;
    }

    // 告知用户生成已开始
    toast("Generating ebook", {
      description: "Your ebook is being generated...",
    });

    // 模拟生成过程
    setIsGenerating(true);

    // 模拟处理时间 (2-4秒)
    setTimeout(
      () => {
        setIsGenerating(false);

        // 显示成功消息
        toast.success("Success", {
          description: "Your ebook has been generated successfully!",
        });

        // 如果需要，这里可以添加实际调用后端生成电子书的逻辑
        // window.ipcRenderer.invoke('generate-ebook', tableData);
      },
      2000 + Math.random() * 2000,
    );
  }, [tableData]);

  // 创建列配置
  const columns = createColumns(handleDelete);

  return (
    <main className="flex flex-col h-screen w-screen p-4">
      <h1 className="text-2xl font-bold mb-4">File Manager</h1>
      <div className="flex-1 overflow-hidden">
        <DraggableDataTable
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
          disabled={tableData.length === 0}
          onClick={handleGenerate}
        >
          Generate Ebook
        </Button>
      </div>
      <ConfigDialog open={isConfigOpen} onOpenChange={setIsConfigOpen} />
    </main>
  );
};

export default App;
