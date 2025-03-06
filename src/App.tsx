import { DraggableDataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { files } from "@/components/data-table/data";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p className="w-full mb-4">Convert your files to EPUB format</p>
      <DraggableDataTable columns={columns} data={files} />
    </main>
  );
}
