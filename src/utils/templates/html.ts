export const createXhtmlDocument = (title: string, content: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />
  </head>
  <body>
    ${content}
  </body>
</html>`;
};

// Create table of contents HTML
export const createTocContent = (tocHtml: string[]): string => {
  return `<h1>Table of Contents</h1>
    <ol>
${tocHtml.join("\n")}
    </ol>`;
};

// Create chapter HTML
export const createChapterContent = (
  chapterTitle: string,
  paragraphs: string,
): string => {
  return `<h1 class="chapter-title">${chapterTitle}</h1>
    <div class="chapter-content">
      ${paragraphs}
    </div>`;
};
