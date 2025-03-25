import PropTypes from "prop-types";
import { FaClock } from "react-icons/fa";

const ContentItem = ({
  content,
  isActive,
  isDarkMode,
  handleContentSelect,
}) => {
  const getFileTypeIcon = () => {
    switch (content.file_type) {
      case "video":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
          </svg>
        );
      case "document":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
      case "image":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
      case "audio":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-5 rounded-xl transition-all cursor-pointer shadow-md ${
        isActive
          ? isDarkMode
            ? "bg-blue-900 border-l-4 border-blue-400"
            : "bg-blue-50 border-l-4 border-blue-500"
          : isDarkMode
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-50"
      }`}
      onClick={() => handleContentSelect(content)}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isActive
              ? isDarkMode
                ? "bg-blue-800 text-blue-200"
                : "bg-blue-100 text-blue-600"
              : isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {getFileTypeIcon()}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{content.title}</h3>
          {content.description && (
            <p
              className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {content.description.length > 120
                ? `${content.description.substring(0, 120)}...`
                : content.description}
            </p>
          )}

          <div
            className={`flex flex-wrap items-center gap-4 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {content.duration > 0 && (
              <span className="flex items-center gap-1">
                <FaClock className="opacity-70" />
                <span>{content.duration} min</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>Type:</span>
              <span className="font-medium">
                {content.file_type
                  ? content.file_type.charAt(0).toUpperCase() +
                    content.file_type.slice(1)
                  : "Unknown"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

ContentItem.propTypes = {
  content: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.number,
    file_type: PropTypes.string,
    full_url: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  handleContentSelect: PropTypes.func.isRequired,
};

export default ContentItem;
