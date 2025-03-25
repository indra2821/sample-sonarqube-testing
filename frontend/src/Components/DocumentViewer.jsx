import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";

const DocumentViewer = ({ src, title }) => {
  const [documentType, setDocumentType] = useState("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const determineDocumentType = () => {
      try {
        const url = new URL(src);
        const extension = url.pathname.split(".").pop().toLowerCase();

        if (["pdf"].includes(extension)) {
          setDocumentType("pdf");
        } else if (["doc", "docx"].includes(extension)) {
          setDocumentType("word");
        } else if (["xls", "xlsx"].includes(extension)) {
          setDocumentType("excel");
        } else if (["ppt", "pptx"].includes(extension)) {
          setDocumentType("powerpoint");
        } else if (["txt", "rtf"].includes(extension)) {
          setDocumentType("text");
        } else {
          setDocumentType("unknown");
        }
      } catch (err) {
        console.error("Error determining document type:", err);
        setDocumentType("unknown");
      } finally {
        setLoading(false);
      }
    };

    determineDocumentType();
  }, [src]);

  const getDocumentIcon = () => {
    switch (documentType) {
      case "pdf":
        return <FaFilePdf className="text-red-500" size={48} />;
      case "word":
        return <FaFileWord className="text-blue-500" size={48} />;
      case "excel":
        return <FaFileExcel className="text-green-500" size={48} />;
      case "powerpoint":
        return <FaFilePowerpoint className="text-orange-500" size={48} />;
      default:
        return <FaFileAlt className="text-gray-500" size={48} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 bg-red-50 rounded-lg">
        <div className="text-red-500 mb-2">Error loading document</div>
        <div className="text-sm text-gray-600 mb-4">{error}</div>
        <a
          href={src}
          download
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FaDownload />
          Download Document
        </a>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getDocumentIcon()}
          <div>
            <h3 className="font-bold text-lg">{title || "Document"}</h3>
            <p className="text-sm text-gray-600 capitalize">
              {documentType} Document
            </p>
          </div>
        </div>
        <a
          href={src}
          download
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FaDownload />
          Download
        </a>
      </div>

      <div className="h-96 w-full">
        {documentType === "pdf" ? (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(src)}&embedded=true`}
            className="w-full h-full"
            title={title || "PDF Document"}
            onError={() => setError("Failed to load document preview")}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {getDocumentIcon()}
            <h4 className="mt-4 font-medium">
              {title || "Document Preview Not Available"}
            </h4>
            <p className="mt-2 text-gray-600">
              This document type doesnt support inline preview. Please download
              to view.
            </p>
            <a
              href={src}
              download
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <FaDownload />
              Download Document
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

DocumentViewer.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default DocumentViewer;
