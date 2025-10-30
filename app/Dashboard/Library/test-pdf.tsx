"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function TestPDF() {
  const [numPages, setNumPages] = useState<number>(0);

  const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer Test</h1>
      <div className="border p-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            console.log("PDF loaded successfully! Pages:", numPages);
          }}
          onLoadError={(error) => {
            console.error("PDF load error:", error);
          }}
          loading={<p>Loading PDF...</p>}
          error={<p>Failed to load PDF</p>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={600}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
