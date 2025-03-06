import { DraggableDataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { files, File, FileStatus } from "@/components/data-table/data";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [tableData, setTableData] = useState(files);

  const handleReorder = (newData: File[]) => {
    setTableData(newData);
  };

  const handleDelete = (id: string) => {
    setTableData((currentData) => currentData.filter((file) => file.id !== id));
  };

  const handleAddFiles = (fileList: FileList) => {
    const newFiles: File[] = Array.from(fileList).map((file) => ({
      id: uuidv4(),
      name: file.name,
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
      ); // 随机延迟，使文件不会同时开始处理
    });
  };

  // 模拟文件处理流程
  const simulateFileProcessing = (fileId: string) => {
    // 更新状态为处理中
    setTableData((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, status: "processing" as FileStatus }
          : file,
      ),
    );

    // 模拟处理时间
    const processingTime = 1000 + Math.random() * 3000; // 2-5秒

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
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p className="w-full mb-4">Convert your files to EPUB format</p>
      <DraggableDataTable
        columns={columns(handleDelete)}
        data={tableData}
        onReorder={handleReorder}
        onAddFiles={handleAddFiles}
      />
    </main>
  );
};

export default App;
