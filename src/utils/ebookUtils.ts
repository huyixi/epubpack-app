import { FileData } from "@/components/data-table/data";
import JSZip from "jszip";

// Helper to create valid XML content
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Generate a valid filename from the title
const generateSafeFilename = (title: string, index: number): string => {
  // Remove invalid characters and replace spaces with underscores
  const safeName = title.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "_");

  return `chapter_${index + 1}_${safeName}.xhtml`;
};

export const generateTextFile = async (files: FileData[]): Promise<void> => {
  try {
    const zip = new JSZip();

    // Add mimetype file (must be first and uncompressed)
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

    // Create META-INF directory with container.xml
    const metaInf = zip.folder("META-INF");
    metaInf?.file(
      "container.xml",
      `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
    );

    // Create OEBPS folder for content
    const oebps = zip.folder("OEBPS");

    // Create CSS file
    oebps?.file(
      "stylesheet.css",
      `
body {
  font-family: serif;
  margin: 5%;
  text-align: justify;
}
h1, h2, h3 {
  text-align: center;
  font-weight: bold;
}
h1 { font-size: 1.5em; margin: 1em 0; }
h2 { font-size: 1.3em; margin: 0.8em 0; }
.chapter-title {
  page-break-before: always;
  margin-top: 2em;
}
p {
  margin: 0.5em 0;
  line-height: 1.5;
}
`,
    );

    // Prepare content.opf and toc.ncx content
    let manifestItems = "";
    let spineItems = "";
    let navPoints = "";
    let tocHtml = "";

    // Process each file to create chapters
    const chapters = files.map((file, index) => {
      const title = escapeXml(file.title);
      const filename = generateSafeFilename(file.title, index);
      const id = `chapter${index + 1}`;

      // Format content as XHTML
      const content = file.content?.trim() || "[No content available]";
      const paragraphs = content
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p)
        .map((p) => `<p>${escapeXml(p)}</p>`)
        .join("\n      ");

      // Create XHTML document for this chapter
      const chapterXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />
  </head>
  <body>
    <h1 class="chapter-title">${title}</h1>
    <div class="chapter-content">
      ${paragraphs}
    </div>
  </body>
</html>`;

      // Add file to OEBPS
      oebps?.file(filename, chapterXhtml);

      // Add to manifest
      manifestItems += `    <item id="${id}" href="${filename}" media-type="application/xhtml+xml" />\n`;

      // Add to spine
      spineItems += `    <itemref idref="${id}" />\n`;

      // Add to navigation
      navPoints += `  <navPoint id="navpoint-${index + 1}" playOrder="${index + 1}">
    <navLabel><text>${title}</text></navLabel>
    <content src="${filename}"/>
  </navPoint>\n`;

      // Add to TOC HTML
      tocHtml += `    <li><a href="${filename}">${title}</a></li>\n`;

      return { id, title, filename };
    });

    // Create table of contents
    const tocXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Table of Contents</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />
  </head>
  <body>
    <h1>Table of Contents</h1>
    <ol>
${tocHtml}
    </ol>
  </body>
</html>`;

    // Add TOC to OEBPS
    oebps?.file("toc.xhtml", tocXhtml);

    // Create NCX file (required for navigation)
    const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${crypto.randomUUID()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>Generated Ebook</text>
  </docTitle>
  <navMap>
    <navPoint id="navpoint-toc" playOrder="0">
      <navLabel><text>Table of Contents</text></navLabel>
      <content src="toc.xhtml"/>
    </navPoint>
${navPoints}
  </navMap>
</ncx>`;

    oebps?.file("toc.ncx", ncx);

    // Create OPF file (package definition)
    const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>Generated Ebook</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${crypto.randomUUID()}</dc:identifier>
    <dc:creator>EPUB Pack</dc:creator>
    <dc:publisher>EPUB Pack</dc:publisher>
    <dc:date>${new Date().toISOString().split("T")[0]}</dc:date>
    <meta name="cover" content="cover-image" />
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="style" href="stylesheet.css" media-type="text/css" />
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" />
${manifestItems}
  </manifest>
  <spine toc="ncx">
    <itemref idref="toc" />
${spineItems}
  </spine>
  <guide>
    <reference type="toc" title="Table of Contents" href="toc.xhtml" />
  </guide>
</package>`;

    oebps?.file("content.opf", contentOpf);

    // Generate the EPUB file
    const content = await zip.generateAsync({
      type: "blob",
      mimeType: "application/epub+zip",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    // Trigger download
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated_ebook.epub";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating EPUB:", error);
    throw error;
  }
};
