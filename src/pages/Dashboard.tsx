import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "@/stores/features/projectsSlice";
import { fetchTasks } from "@/stores/features/tasksSlice";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import { RootState, AppDispatch } from "@/stores/store";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const projects = useSelector((state: RootState) => state.projects.projects);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityPending = tasks.filter(
    (task) => task.priority === "high" && task.status !== "done"
  ).length;

  const projectsWithTasks = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const completed = projectTasks.filter(
      (task) => task.status === "done"
    ).length;
    const total = projectTasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      name: project.name,
      totalTasks: total,
      completedTasks: completed,
      completionRate: Math.round(completionRate),
      remaining: total - completed,
    };
  });

  const statusDistributionData = [
    { name: "To Do", value: todoTasks, fill: "#3b82f6" },
    { name: "In Progress", value: inProgressTasks, fill: "#f59e0b" },
    { name: "Completed", value: completedTasks, fill: "#10b981" },
  ];

  const priorityDistributionData = [
    {
      name: "High",
      value: tasks.filter((task) => task.priority === "high").length,
      fill: "#ef4444",
    },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "medium").length,
      fill: "#f59e0b",
    },
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "low").length,
      fill: "#3b82f6",
    },
  ];

  const projectProgressData = projectsWithTasks
    .map((project) => ({
      name:
        project.name.length > 12
          ? project.name.substring(0, 12) + "..."
          : project.name,
      completionRate: project.completionRate,
    }))
    .sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div className="container mx-auto p-4 dark:bg-black dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">
        Project Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Tasks Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Tasks
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 dark:text-gray-500"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <div className="text-2xl font-bold dark:text-gray-100">
            {totalTasks}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Across {projects.length} projects
          </p>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Completion Rate
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 dark:text-gray-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="text-2xl font-bold dark:text-gray-100">
            {completionRate}%
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {/* In Progress Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              In Progress
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 dark:text-gray-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="text-2xl font-bold dark:text-gray-100">
            {inProgressTasks}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round((inProgressTasks / totalTasks) * 100) || 0}% of all
            tasks
          </p>
        </div>

        {/* High Priority Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              High Priority
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 dark:text-gray-500"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="text-2xl font-bold dark:text-gray-100">
            {highPriorityPending}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            High priority tasks pending
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Project Progress Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <h2 className="text-lg font-semibold mb-1 dark:text-gray-100">
            Project Progress
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Task completion rate by project
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectProgressData}
                margin={{ top: 5, right: 5, left: 5, bottom: 25 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]}>
                  <Label
                    value="Completion %"
                    angle={-90}
                    position="insideLeft"
                  />
                </YAxis>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Completion Rate"]}
                />
                <Bar dataKey="completionRate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <h2 className="text-lg font-semibold mb-1 dark:text-gray-100">
            Task Status Distribution
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Overview of task status
          </p>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Tasks`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <h2 className="text-lg font-semibold mb-1 dark:text-gray-100">
            Task Priority Distribution
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tasks by priority level
          </p>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {priorityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Tasks`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Tasks Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700">
          <h2 className="text-lg font-semibold mb-1 dark:text-gray-100">
            Project Tasks Breakdown
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tasks completed vs. remaining by project
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectsWithTasks.filter((p) => p.totalTasks > 0)}
                margin={{ top: 5, right: 5, left: 5, bottom: 25 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completedTasks"
                  stackId="a"
                  name="Completed"
                  fill="#10b981"
                />
                <Bar
                  dataKey="remaining"
                  stackId="a"
                  name="Remaining"
                  fill="#f87171"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
