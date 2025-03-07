export type FileStatus = "processing" | "done" | "failed";

export type FileData = {
  id: string;
  title: string;
  status: FileStatus;
  content?: string;
  file?: File;
};

export const initialFiles: FileData[] = [];
