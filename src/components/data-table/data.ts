export type FileStatus = "processing" | "done" | "failed";
export type FileData = {
  id: string;
  title: string;
  status: FileStatus;
};

export const initialFiles: FileData[] = [
  {
    id: "TASK-8782",
    title: "example-processing",
    status: "processing",
  },
  {
    id: "TASK-6543",
    title: "example-done",
    status: "done",
  },
  {
    id: "TASK-3210",
    title: "example-failed",
    status: "failed",
  },
];
