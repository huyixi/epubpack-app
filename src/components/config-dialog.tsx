"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft, Grid2X2, Calendar, Settings2, Network } from "lucide-react";

export function ConfigDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="metadata"
          className="flex h-[600px]"
          orientation="vertical"
        >
          <TabsList className="flex h-full w-60 flex-col justify-start items-stretch gap-1 rounded-none bg-muted/50 p-2">
            <div className="p-4 mb-2">
              <h2 className="text-lg font-semibold">Config</h2>
              <p className="text-sm text-muted-foreground">
                Customize your export configuration, or use the default export
                settings directly
              </p>
            </div>
            <TabsTrigger
              value="metadata"
              className="justify-start gap-2 px-4 h-10"
            >
              <AlignLeft className="h-4 w-4" />
              Metadata
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="justify-start gap-2 px-4 h-10"
            >
              <Grid2X2 className="h-4 w-4" />
              Image
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="justify-start gap-2 px-4 h-10"
            >
              <Network className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="size" className="justify-start gap-2 px-4 h-10">
              <Calendar className="h-4 w-4" />
              File Size
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="justify-start gap-2 px-4 h-10"
            >
              <Settings2 className="h-4 w-4" />
              Advanced settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metadata" className="flex-1 p-6 m-0 border-l">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <Input placeholder="Title" className="w-full mb-4" />
                <Input placeholder="Author" className="w-full mb-4" />
                <Input placeholder="Description" className="w-full" />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="flex-1 p-6 m-0 border-l">
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
          </TabsContent>

          <TabsContent value="content" className="flex-1 p-6 m-0 border-l">
            <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Table of Contents</label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue placeholder="Select TOC option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-generate</SelectItem>
                    <SelectItem value="manual">Manually create</SelectItem>
                    <SelectItem value="none">No table of contents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chapter Style</label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="decorative">Decorative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="size" className="flex-1 p-6 m-0 border-l">
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
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-6 m-0 border-l">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
