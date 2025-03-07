import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdvancedSettingsTab() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">EPUB Version</label>
          <Select defaultValue="3.0">
            <SelectTrigger>
              <SelectValue placeholder="Select EPUB version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2.0">EPUB 2.0</SelectItem>
              <SelectItem value="3.0">EPUB 3.0</SelectItem>
              <SelectItem value="3.2">EPUB 3.2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">CSS Customization</label>
          <Select defaultValue="default">
            <SelectTrigger>
              <SelectValue placeholder="CSS options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Use default styling</SelectItem>
              <SelectItem value="minimal">Minimal styling</SelectItem>
              <SelectItem value="custom">Custom CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Accessibility</label>
          <Select defaultValue="enhanced">
            <SelectTrigger>
              <SelectValue placeholder="Accessibility options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic features</SelectItem>
              <SelectItem value="enhanced">Enhanced features</SelectItem>
              <SelectItem value="full">Full accessibility</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
