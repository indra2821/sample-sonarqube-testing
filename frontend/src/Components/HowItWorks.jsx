const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Course",
      description:
        "Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique.",
    },
    {
      number: "02",
      title: "Sign Up and Enroll",
      description:
        "Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique.",
    },
    {
      number: "03",
      title: "Learn and get Certified",
      description:
        "Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique.",
    },
  ];

  return (
    <div className="container mx-auto text-center py-16">
      <p className="text-primary font-semibold text-sm uppercase">
        How It Works
      </p>
      <h2 className="text-4xl font-bold text-black mt-2">
        Your Online Learning Journey Made Easy
      </h2>
      <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
        Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique
        mauris id vitae. Id pulvinar a eget vitae pellentesque ridiculus platea.
        Vulputate cursus.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-[--text-primary] text-white text-lg font-bold rounded-full">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
            <p className="text-gray-500 mt-2 max-w-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
