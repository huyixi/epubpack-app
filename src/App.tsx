import { DataTable } from "@/components/data-table";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p className="w-full mb-4">Convert your files to EPUB format</p>
      <DataTable />
    </main>
  );
}
