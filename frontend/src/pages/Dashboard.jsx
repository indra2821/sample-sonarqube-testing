import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { selectIsDarkMode } from "../Redux/themeSlice";

const Dashboard = ({ role }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-theme border border-theme rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-theme-primary mb-4">
          Welcome to Your Dashboard
        </h1>
        <p className="text-theme-secondary mb-6">
          You are logged in as a <span className="font-medium">{role}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-theme border border-theme rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-theme-primary mb-2">
              My Courses
            </h2>
            <p className="text-theme-secondary">
              {isDarkMode
                ? "Access your courses in dark mode for comfortable learning at night."
                : "Start learning from your enrolled courses."}
            </p>
          </div>

          <div className="bg-theme border border-theme rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-theme-primary mb-2">
              Assignments
            </h2>
            <p className="text-theme-secondary">
              Check your pending assignments and deadlines.
            </p>
          </div>

          <div className="bg-theme border border-theme rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-theme-primary mb-2">
              Progress
            </h2>
            <p className="text-theme-secondary">
              Track your learning progress and achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  role: PropTypes.string.isRequired,
};

export default Dashboard;
