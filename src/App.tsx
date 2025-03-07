import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { DraggableDataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import {
  initialFiles,
  FileData,
  FileStatus,
} from "@/components/data-table/data";

const App = () => {
  const [tableData, setTableData] = useState<FileData[]>(initialFiles);

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

  // 创建列配置
  const columns = createColumns(handleDelete);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">File Manager</h1>
      <DraggableDataTable
        columns={columns}
        data={tableData}
        onReorder={handleReorder}
        onAddFiles={handleAddFiles}
      />
    </main>
  );
};

export default App;
