// Container XML for EPUB
export const CONTAINER_XML = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

// NCX template for navigation
export const createNcxContent = (
  title: string,
  uuid: string,
  navPoints: string[],
): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${title}</text>
  </docTitle>
  <navMap>
    <navPoint id="navpoint-toc" playOrder="0">
      <navLabel><text>Table of Contents</text></navLabel>
      <content src="toc.xhtml"/>
    </navPoint>
${navPoints.join("\n")}
  </navMap>
</ncx>`;
};

// OPF template for package metadata
export const createOpfContent = (
  title: string,
  uuid: string,
  currentDate: string,
  manifestItems: string[],
  spineItems: string[],
): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${uuid}</dc:identifier>
    <dc:creator>EPUB Pack</dc:creator>
    <dc:publisher>EPUB Pack</dc:publisher>
    <dc:date>${currentDate}</dc:date>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="style" href="stylesheet.css" media-type="text/css" />
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" />
${manifestItems.join("\n")}
  </manifest>
  <spine toc="ncx">
    <itemref idref="toc" />
${spineItems.join("\n")}
  </spine>
  <guide>
    <reference type="toc" title="Table of Contents" href="toc.xhtml" />
  </guide>
</package>`;
};
