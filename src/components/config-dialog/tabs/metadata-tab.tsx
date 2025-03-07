import { Input } from "@/components/ui/input";

export function MetadataTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Metadata</h3>
        <Input placeholder="Title" className="w-full mb-4" />
        <Input placeholder="Author" className="w-full mb-4" />
        <Input placeholder="Description" className="w-full" />
      </div>
    </div>
  );
}
