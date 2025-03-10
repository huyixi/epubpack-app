import { FileData } from "@/components/data-table/data";
import JSZip from "jszip";
import { CSS_CONTENT } from "./templates/css";
import {
  CONTAINER_XML,
  createNcxContent,
  createOpfContent,
} from "./templates/xml";
import {
  createXhtmlDocument,
  createTocContent,
  createChapterContent,
} from "./templates/html";

// Helper to create valid XML content
const escapeXml = (text: string): string => {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };
  return text.replace(/[&<>"']/g, (char) => entities[char]);
};

// Generate a valid filename from the title
const generateSafeFilename = (title: string, index: number): string => {
  const safeName = title
    .toLowerCase()
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50); // Limit filename length

  return `chapter_${(index + 1).toString().padStart(2, "0")}_${safeName}.xhtml`;
};

export const generateEpub = async (files: FileData[]): Promise<void> => {
  try {
    const zip = new JSZip();
    const uuid = crypto.randomUUID();
    const currentDate = new Date().toISOString().split("T")[0];
    const title = "Generated Ebook";

    // Add mimetype file (must be first and uncompressed)
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

    // Create META-INF directory with container.xml
    zip.folder("META-INF")?.file("container.xml", CONTAINER_XML);

    // Create OEBPS folder for content
    const oebps = zip.folder("OEBPS");
    oebps?.file("stylesheet.css", CSS_CONTENT);

    // Process each file to create chapters
    const chapters = files.map((file, index) => {
      const chapterTitle = escapeXml(file.title);
      const filename = generateSafeFilename(file.title, index);
      const id = `chapter${index + 1}`;

      // Format content as XHTML paragraphs
      const content = file.content?.trim() || "[No content available]";
      const paragraphs = content
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p)
        .map((p) => `<p>${escapeXml(p)}</p>`)
        .join("\n      ");

      // Create chapter content with title
      const chapterContent = createChapterContent(chapterTitle, paragraphs);

      // Add file to OEBPS
      oebps?.file(filename, createXhtmlDocument(chapterTitle, chapterContent));

      return { id, title: chapterTitle, filename };
    });

    // Build tables of contents and navigation structures
    const { manifestItems, spineItems, navPoints, tocHtml } = chapters.reduce<{
      manifestItems: string[];
      spineItems: string[];
      navPoints: string[];
      tocHtml: string[];
    }>(
      (acc, chapter, index) => {
        acc.manifestItems.push(
          `    <item id="${chapter.id}" href="${chapter.filename}" media-type="application/xhtml+xml" />`,
        );
        acc.spineItems.push(`    <itemref idref="${chapter.id}" />`);
        acc.navPoints.push(
          `  <navPoint id="navpoint-${index + 1}" playOrder="${index + 1}">
    <navLabel><text>${chapter.title}</text></navLabel>
    <content src="${chapter.filename}"/>
  </navPoint>`,
        );
        acc.tocHtml.push(
          `    <li><a href="${chapter.filename}">${chapter.title}</a></li>`,
        );
        return acc;
      },
      { manifestItems: [], spineItems: [], navPoints: [], tocHtml: [] },
    );

    // Create table of contents
    const tocContent = createTocContent(tocHtml);
    oebps?.file(
      "toc.xhtml",
      createXhtmlDocument("Table of Contents", tocContent),
    );

    // Create NCX file (required for navigation)
    const ncx = createNcxContent(title, uuid, navPoints);
    oebps?.file("toc.ncx", ncx);

    // Create OPF file (package definition)
    const contentOpf = createOpfContent(
      title,
      uuid,
      currentDate,
      manifestItems,
      spineItems,
    );
    oebps?.file("content.opf", contentOpf);

    // Generate the EPUB file
    const content = await zip.generateAsync({
      type: "blob",
      mimeType: "application/epub+zip",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    // Download the file
    downloadFile(content, "generated_ebook.epub");
  } catch (error) {
    console.error("Error generating EPUB:", error);
    throw error;
  }
};

// Helper function to download a file
const downloadFile = (content: Blob, filename: string): void => {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append to body, trigger click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Proper implementation of generateTextFile for backward compatibility
export const generateTextFile = async (files: FileData[]): Promise<void> => {
  try {
    // Create a single text file with all content
    let textContent = "";

    files.forEach((file, index) => {
      // Add title and content with proper spacing
      textContent += `${file.title}\n\n`;
      textContent += `${file.content?.trim() || "[No content available]"}\n\n`;

      // Add separator between chapters (except for the last one)
      if (index < files.length - 1) {
        textContent += "------------------------\n\n";
      }
    });

    // Create a Blob with the text content
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });

    // Download the file
    downloadFile(blob, "generated_book.txt");
  } catch (error) {
    console.error("Error generating text file:", error);
    throw error;
  }
};
