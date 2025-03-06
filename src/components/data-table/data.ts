export type File = {
  id: string;
  title: string;
  status: "processing" | "done" | "failed";
};

export const files: File[] = [
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
