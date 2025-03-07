import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContentTab() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Image Quality</label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Select image quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (smaller file size)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High (better quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image</label>
          <Button variant="outline" className="w-full">
            Upload Cover Image
          </Button>
        </div>
      </div>
    </>
  );
}
