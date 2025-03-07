import React from "react";
import { LoaderCircle, FileWarning, CircleCheck } from "lucide-react";
import type { FileStatus } from "./data";

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
}

const statusConfig: Record<FileStatus, StatusConfig> = {
  processing: {
    icon: <LoaderCircle className="h-4 w-4 mr-1 animate-spin" />,
    label: "Processing",
  },
  done: {
    icon: <CircleCheck className="h-4 w-4 mr-1 text-success" />,
    label: "Completed",
  },
  failed: {
    icon: <FileWarning className="h-4 w-4 mr-1 text-destructive" />,
    label: "Failed",
  },
};

interface FileStatusIconProps {
  status: FileStatus;
  showLabel?: boolean;
}

export const FileStatusIcon: React.FC<FileStatusIconProps> = ({
  status,
  showLabel = false,
}) => {
  const { icon, label } = statusConfig[status];

  return (
    <div className="flex items-center">
      {icon}
      {showLabel && <span>{label}</span>}
    </div>
  );
};
