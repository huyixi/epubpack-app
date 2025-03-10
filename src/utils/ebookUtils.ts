// src/utils/ebookUtils.ts

import { FileData } from "@/components/data-table/data";

export const generateTextFile = (files: FileData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Combine all file contents in the order shown in the table
      const combinedContent = files.map((file) => {
        const title = `\n\n--- ${file.title} ---\n\n`;
        const content = file.content || "[No content available]";
        return title + content;
      }).join("\n\n");

      // Create a blob from the combined content
      const blob = new Blob([combinedContent], { type: "text/plain" });

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "combined_output.txt";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
