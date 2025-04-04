import { useSelector } from "react-redux";
import { selectCurrentUser } from "../Redux/userSlice";
import LoadingSpinner from "../Components/LoadingSpinner";
import { selectIsDarkMode } from "../Redux/themeSlice";

const Dashboard = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const { name, role, isAuthenticated, tokenChecked } =
    useSelector(selectCurrentUser); 

  // Show loading spinner while checking auth status
  if (!tokenChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated (handled by ProtectedRoute)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`bg-theme border border-theme rounded-lg shadow-lg p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-2xl font-bold text-theme-primary mb-2">
          Welcome, {name}!
        </h1>
        <p className="text-theme-secondary mb-6">
          You are logged in as{" "}
          <span className="font-medium capitalize">{role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Instructor Specific Dashboard */}
          {role === "Instructor" && (
            <>
              <div className="bg-theme border border-theme rounded-md shadow p-4">
                <h2 className="text-lg font-semibold text-theme-primary mb-2">
                  My Courses
                </h2>
                <p className="text-theme-secondary">
                  Manage your courses and view student progress.
                </p>
                <button className="mt-3 btn-primary py-1 px-3 rounded text-sm">
                  View Courses
                </button>
              </div>

              <div className="bg-theme border border-theme rounded-md shadow p-4">
                <h2 className="text-lg font-semibold text-theme-primary mb-2">
                  Create New Course
                </h2>
                <p className="text-theme-secondary">
                  Start building a new course for your students.
                </p>
                <button className="mt-3 btn-primary py-1 px-3 rounded text-sm">
                  Create Course
                </button>
              </div>

              <div className="bg-theme border border-theme rounded-md shadow p-4">
                <h2 className="text-lg font-semibold text-theme-primary mb-2">
                  Student Analytics
                </h2>
                <p className="text-theme-secondary">
                  Track student engagement and performance.
                </p>
                <button className="mt-3 btn-primary py-1 px-3 rounded text-sm">
                  View Analytics
                </button>
              </div>
            </>
          )}

          {/* Student Specific Dashboard */}
          {role === "Student" && (
            <>
              <div className="bg-theme border border-theme rounded-md shadow p-4">
                <h2 className="text-lg font-semibold text-theme-primary mb-2">
                  My Courses
                </h2>
                <p className="text-theme-secondary">
                  {isDarkMode
                    ? "Access your courses in dark mode for comfortable learning at night."
                    : "Start learning from your enrolled courses."}
                </p>
                <button className="mt-3 btn-primary py-1 px-3 rounded text-sm">
                  Continue Learning
                </button>
              </div>

              <div className="bg-theme border border-theme rounded-md shadow p-4">
                <h2 className="text-lg font-semibold text-theme-primary mb-2">
                  Assignments
                </h2>
                <p className="text-theme-secondary">
                  Check your pending assignments and deadlines.
                </p>
                <button className="mt-3 btn-primary py-1 px-3 rounded text-sm">
                  View Assignments
                </button>
              </div>

              <div className="bg-theme border border-theme rounded-md shadow p-4">
                <h2 className="text-lg font-semibold text-theme-primary mb-2">
                  Progress
                </h2>
                <p className="text-theme-secondary">
                  Track your learning progress and achievements.
                </p>
                <button className="mt-3 btn-primary py-1 px-3 rounded text-sm">
                  View Progress
                </button>
              </div>
            </>
          )}
        </div>

        {/* Common Dashboard Elements */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-theme-primary mb-4">
            Recent Activity
          </h2>
          <div className="bg-theme border border-theme rounded-md shadow p-4">
            <p className="text-theme-secondary">
              {role === "Instructor"
                ? "You have 5 new student submissions to review."
                : "You have 3 new lessons available in your courses."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
