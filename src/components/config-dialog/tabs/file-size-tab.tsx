import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FileSizeTab() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">File Size Options</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Compression Level</label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Select compression level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (larger file)</SelectItem>
              <SelectItem value="medium">Medium (balanced)</SelectItem>
              <SelectItem value="high">High (smaller file)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Embed Fonts</label>
          <Select defaultValue="essential">
            <SelectTrigger>
              <SelectValue placeholder="Font embedding options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fonts</SelectItem>
              <SelectItem value="essential">Essential only</SelectItem>
              <SelectItem value="none">No embedded fonts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
