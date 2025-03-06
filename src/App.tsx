import { DraggableDataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { files, File } from "@/components/data-table/data";
import { useState } from "react";

const App = () => {
  const [tableData, setTableData] = useState(files);

  const handleReorder = (newData: File[]) => {
    setTableData(newData);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p className="w-full mb-4">Convert your files to EPUB format</p>
      <DraggableDataTable
        columns={columns}
        data={tableData}
        onReorder={handleReorder}
      />
    </main>
  );
};

export default App;
