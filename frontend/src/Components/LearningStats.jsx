const LearningStats = () => {
  return (
    <>
      {/* Existing LearningStats Section */}
      <section className="w-full py-12 bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "34K+", label: "Success Stories" },
              { value: "210+", label: "Expert Instructors" },
              { value: "54K+", label: "Online Courses" },
              { value: "80K+", label: "Worldwide Members" },
            ].map((stat, index) => (
              <div key={index} className="border-r last:border-0 border-white">
                <h2 className="text-4xl font-bold mb-2">{stat.value}</h2>
                <p className="text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Section from the Image */}
      <section className="py-16 bg-bg-light dark:bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <p className="text-green-500 font-semibold uppercase">
                Who We Are
              </p>
              <h2 className="text-4xl font-bold text-text-light-primary dark:text-white mt-2">
                Your Online Learning Partner
              </h2>
              <p className="text-text-light-secondary dark:text-gray-300 mt-4">
                Egestas faucibus nisl et ultricies. Tempus lectus condimentum
                tristique mauris id vitae. Id pulvinar a eget vitae pellentesque
                ridiculus platea. Vulputate cursus.
              </p>
            </div>

            {/* Right Content - Video Course Card */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold text-text-light-primary dark:text-white">
                Video Course <span className="text-gray-500">(1/110)</span>
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between bg-blue-500 text-white p-3 rounded-md">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-white rounded-full"></span>
                    Introduction
                  </span>
                  <span>7:00</span>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-3 mt-2 rounded-md">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
                    Social Media Marketing
                  </span>
                  <span>65:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "📘",
                title: "Online Courses",
                description:
                  "Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique mauris id vitae. Id pulvinar eget vitae.",
                color: "bg-blue-500",
              },
              {
                icon: "⬆️",
                title: "Upgrade Skills",
                description:
                  "Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique mauris id vitae. Id pulvinar eget vitae.",
                color: "bg-green-500",
              },
              {
                icon: "🏆",
                title: "Certifications",
                description:
                  "Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique mauris id vitae. Id pulvinar eget vitae.",
                color: "bg-orange-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center text-white rounded-full ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-light-primary dark:text-white mt-4">
                  {feature.title}
                </h3>
                <p className="text-text-light-secondary dark:text-gray-300 mt-2">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LearningStats;
