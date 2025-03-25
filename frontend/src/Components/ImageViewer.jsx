import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import {
  FaExpand,
  FaCompress,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ImageViewer = ({ src, title }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Reset position when scale changes
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Image container */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden relative"
        style={{
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          height: isFullscreen ? "100vh" : "70vh",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imageRef}
          src={src}
          alt={title || "Image"}
          className="max-w-full max-h-full object-contain"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease",
          }}
        />
      </div>

      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex justify-between items-center">
        <h3 className="text-white font-medium truncate max-w-[70%]">
          {title || "Image"}
        </h3>
        <div className="flex gap-2">
          <a
            href={src}
            download
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            title="Download"
          >
            <FaDownload />
          </a>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white rounded-full p-2 flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${scale <= 0.5 ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Zoom Out"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={resetZoom}
          className="px-3 py-1 text-sm hover:bg-white/20 transition-colors rounded"
          title="Reset Zoom"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 3}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${scale >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Zoom In"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Navigation hint (only shown when zoomed) */}
      {scale > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          Click and drag to navigate
        </div>
      )}
    </div>
  );
};

ImageViewer.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default ImageViewer;
