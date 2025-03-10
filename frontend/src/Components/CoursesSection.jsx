import { useEffect, useRef } from "react";
import PropTypes from "prop-types"; 
import { FaArrowRightLong } from "react-icons/fa6";

const CoursesSection = ({ isDarkMode }) => {
  const carouselRef = useRef(null);
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

  
  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 1;

    const scroll = () => {
      if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollAmount;
      }
    };

    const interval = setInterval(scroll, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`py-12 ${isDarkMode ? "bg-[#000814] text-white" : "bg-[#f2e9e4] text-gray-900"}`}
    >
      <h2 className="text-3xl font-bold text-center mb-6">Our Courses</h2>
      <div
        className="relative overflow-hidden"
        onMouseDown={startDragging}
        onMouseMove={onDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide whitespace-nowrap cursor-grab"
        >
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`w-80 p-6 rounded-lg shadow-lg flex-shrink-0 ${
                index % 2 === 0
                  ? "bg-[#F77F00] text-white"
                  : "bg-[#05668D] text-white"
              }`}
            >
              <h3 className="text-xl font-semibold">Course {index + 1}</h3>
              <p className="text-sm mt-2">
                Learn the fundamentals of this course.
              </p>
              <button className="mt-4 bg-white text-black p-2 rounded-full hover:bg-gray-300 transition">
                <FaArrowRightLong className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


CoursesSection.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
};

export default CoursesSection;
