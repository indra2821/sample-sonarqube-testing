const Benefits = () => {
  const benefits = [
    {
      id: "01",
      title: "Standardization",
      description:
        "When working in a global workplace, it's often difficult to gauge learners’ training experiences, which are ...",
    },
    {
      id: "02",
      title: "Reduced Costs",
      description:
        "With eLearning, there’s no cost to reproduce materials and, thanks to mobile learning and microlearning, learners can ...",
    },
    {
      id: "03",
      title: "More Customization",
      description:
        "Just like learners aren’t one-size-fits-all, learning is not a one-size-fits-all experience. By using different ...",
    },
    {
      id: "04",
      title: "Affordable Pricing",
      description:
        "With eLearning, there’s no cost to reproduce materials and, thanks to mobile learning and microlearning, learners can ...",
    },
    {
      id: "05",
      title: "Learner Satisfaction",
      description:
        "If you really want students to retain what they learn, you'll need to aim for high satisfaction rates. Bad ...",
    },
    {
      id: "06",
      title: "Multimedia Materials",
      description:
        "One of the main reasons why custom eLearning is effective is that it’s the perfect delivery method for ...",
    },
  ];

  return (
    <section className="py-16 px-20 text-center bg-light dark:bg-dark transition-colors duration-300">
      <h2 className="text-green-600 font-semibold uppercase tracking-wide">Our Benefits</h2>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-3 max-w-3xl mx-auto">
        By Joining eLearning Platform, One Can Avail a Lot Of Benefits.
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
        Install our top-rated dropshipping app to your e-commerce site and get
        access to US Suppliers, AliExpress vendors, and the best.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg text-left flex flex-col justify-between transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xl font-bold bg-green-200 dark:bg-green-700 px-3 py-1 rounded-full">
                {benefit.id}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{benefit.description}</p>
            <a href="#" className="text-green-600 dark:text-green-400 font-semibold mt-3 inline-block">
              Read More
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center items-center gap-6">
        <button className="text-gray-900 dark:text-white font-semibold text-lg hover:underline">
          View All Features
        </button>
        <button className="bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all">
          All Features →
        </button>
      </div>
    </section>
  );
};

export default Benefits;
