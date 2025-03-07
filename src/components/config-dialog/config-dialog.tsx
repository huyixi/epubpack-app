"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft, Calendar, Settings2, Network } from "lucide-react";

import { MetadataTab } from "./tabs/metadata-tab";
import { ContentTab } from "./tabs/content-tab";
import { FileSizeTab } from "./tabs/file-size-tab";
import { AdvancedSettingsTab } from "./tabs/advanced-settings-tab";

export function ConfigDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 gap-0">
        <Tabs defaultValue="metadata" className="flex flex-row ">
          <TabsList className="bg-gray-100 flex h-full w-60 flex-col justify-start items-stretch gap-1 rounded-sm p-2 border-r">
            <div className="p-4 mb-2">
              <h2 className="text-lg font-semibold">Config</h2>
            </div>
            <TabsTrigger
              value="metadata"
              className="justify-start gap-2 px-4 h-10"
            >
              <AlignLeft className="h-4 w-4" />
              Metadata
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

          <TabsContent
            value="metadata"
            className="flex-1 p-6 m-0 bg-white rounded-sm"
          >
            <MetadataTab />
          </TabsContent>

          <TabsContent
            value="content"
            className="flex-1 p-6 m-0 bg-white rounded-sm"
          >
            <ContentTab />
          </TabsContent>

          <TabsContent
            value="size"
            className="flex-1 p-6 m-0 bg-white rounded-sm"
          >
            <FileSizeTab />
          </TabsContent>

          <TabsContent
            value="settings"
            className="flex-1 p-6 m-0 bg-white rounded-sm"
          >
            <AdvancedSettingsTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
