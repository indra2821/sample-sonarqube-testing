import PropTypes from "prop-types";
import { FaFileDownload, FaFile } from "react-icons/fa";

const DefaultViewer = ({ src }) => {
  const getFileType = () => {
    try {
      const url = new URL(src);
      const extension = url.pathname.split(".").pop().toLowerCase();
      return extension || "unknown";
    } catch {
      return "unknown";
    }
  };

  const fileType = getFileType();

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <FaFile className="text-gray-400 dark:text-gray-500 text-5xl" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
          File Preview Not Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We cant display a preview for this {fileType} file type. Please
          download the file to view it.
        </p>
        <a
          href={src}
          download
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaFileDownload className="mr-2" />
          Download File
        </a>
      </div>
    </div>
  );
};

DefaultViewer.propTypes = {
  src: PropTypes.string.isRequired,
};

export default DefaultViewer;
