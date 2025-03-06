export type File = {
  id: string;
  title: string;
  status: "in-progress" | "done" | "failed";
};

export const files: File[] = [
  {
    id: "TASK-8782",
    title: "Create new landing page",
    status: "in-progress",
  },
  {
    id: "TASK-7891",
    title: "Fix navigation bug",
    status: "in-progress",
  },
  {
    id: "TASK-6543",
    title: "Update user documentation",
    status: "done",
  },
  {
    id: "TASK-5432",
    title: "Implement authentication",
    status: "in-progress",
  },
  {
    id: "TASK-4321",
    title: "Design new logo",
    status: "in-progress",
  },
  {
    id: "TASK-3210",
    title: "Optimize database queries",
    status: "failed",
  },
];
