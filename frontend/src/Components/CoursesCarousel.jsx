import { useEffect, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../Redux/themeSlice";

const CoursesCarousel = () => {
  const carouselRef = useRef(null);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Dragging logic remains the same
  let isDragging = false,
    startX,
    scrollLeft;

  const startDragging = (e) => {
    isDragging = true;
    startX = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft = carouselRef.current.scrollLeft;
  };

  const onDragging = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => {
    isDragging = false;
  };

  // Auto-scroll logic
  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 1;
    let pause = false;

    const scroll = () => {
      if (pause) return;
      if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollAmount;
      }
    };

    const interval = setInterval(scroll, 20);

    // Pause on hover
    const handleMouseEnter = () => (pause = true);
    const handleMouseLeave = () => (pause = false);

    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(interval);
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`py-12 transition-colors duration-300 ${
        isDarkMode ? "bg-[#000814] text-white" : "bg-[#f2e9e4] text-gray-900"
      }`}
    >
      {/* 🔹 Title Section */}
      <div className="text-center mb-10">
        <p className="text-2xl text-grey-600 font-semibold">Our Courses</p>
        <h2 className="text-5xl font-bold mt-2">
          Fostering a playful & engaging learning environment
        </h2>
      </div>

      {/* Courses Carousel */}
      <div
        className="relative overflow-hidden"
        onMouseDown={startDragging}
        onMouseMove={onDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide whitespace-nowrap cursor-grab h-[280px] pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`w-96 h-60 p-8 rounded-xl shadow-lg flex-shrink-0 ${
                index % 2 === 0
                  ? "bg-[#F77F00] text-white"
                  : "bg-[#05668D] text-white"
              }`}
            >
              <h3 className="text-2xl font-semibold">Course {index + 1}</h3>
              <p className="text-base mt-3">
                Learn the fundamentals of this course.
              </p>
              <button className="mt-5 bg-white text-black p-3 rounded-full hover:bg-gray-300 transition-colors">
                <FaArrowRightLong className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesCarousel;
