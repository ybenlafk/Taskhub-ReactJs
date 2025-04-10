import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  PlusCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { RootState, AppDispatch } from "@/stores/store";
import { fetchProjects } from "@/stores/features/projectsSlice";
import { fetchTasks, updateTask } from "@/stores/features/tasksSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types/Task";
import TaskCard from "@/components/common/TaskCard";
import TaskFormModal from "@/components/common/TaskFormModal";

const statusColumns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks, status: tasksStatus } = useSelector(
    (state: RootState) => state.tasks
  );

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((task) => task.projectId === id);

  // Filter tasks based on search query and priority
  const filteredTasks = projectTasks.filter((task) => {
    // Text search filter
    const matchesSearchQuery =
      !searchQuery.trim() ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Priority filter
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // Both filters must pass
    return matchesSearchQuery && matchesPriority;
  });

  // Group tasks by status
  const tasksByStatus = statusColumns.reduce((acc, column) => {
    acc[column.id] = filteredTasks
      .filter((task) => task.status === column.id)
      .sort((a, b) => {
        // Sort by priority (high > medium > low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    return acc;
  }, {} as Record<string, Task[]>);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    console.log("Drag started for task:", task);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // For better UX, set a ghost image or customize the drag appearance
    try {
      // Create a clone of the task card for the drag image (optional)
      const dragElement = e.currentTarget.cloneNode(true) as HTMLElement;
      dragElement.style.width = `${e.currentTarget.clientWidth}px`;
      dragElement.style.position = "absolute";
      dragElement.style.top = "-1000px";
      dragElement.style.opacity = "0.8";
      document.body.appendChild(dragElement);
      e.dataTransfer.setDragImage(dragElement, 0, 0);

      // Clean up the drag image after a short delay
      setTimeout(() => {
        document.body.removeChild(dragElement);
      }, 0);
    } catch (err) {
      console.error("Error setting drag image:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();

    if (!draggedTask) return;

    // Only update if the status has changed
    if (draggedTask.status !== statusId) {
      dispatch(
        updateTask({
          ...draggedTask,
          status: statusId as "todo" | "in-progress" | "done",
        })
      );
    }

    setDraggedTask(null);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle priority filter change
  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value);
  };

  // Calculate total filtered tasks
  const totalFilteredTasks = Object.values(tasksByStatus).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  );

  if (tasksStatus === "loading") {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">Project not found</h2>
          <p className="mb-8 mt-2 text-muted-foreground">
            We couldn't find the project you're looking for.
          </p>
          <Button onClick={() => navigate("/projects")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          <Button
            className="mt-4 md:mt-0"
            onClick={() => setIsTaskModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Search and Filter bar */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
            </div>

            {/* Priority filter */}
            <div className="w-full sm:w-48">
              <Select
                value={priorityFilter}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter feedback */}
          {(searchQuery || priorityFilter !== "all") && (
            <div className="mt-2 text-sm text-muted-foreground">
              Found {totalFilteredTasks} task(s)
              {searchQuery && ` matching "${searchQuery}"`}
              {priorityFilter !== "all" && ` with ${priorityFilter} priority`}
            </div>
          )}

          {/* Clear filters button */}
          {(searchQuery || priorityFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-8 text-xs"
              onClick={() => {
                setSearchQuery("");
                setPriorityFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-muted/50 rounded-lg overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 bg-muted font-medium border-b">
                <div className="flex justify-between items-center">
                  <h3>{column.title}</h3>
                  <div className="bg-background rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {tasksByStatus[column.id]?.length || 0}
                  </div>
                </div>
              </div>
              <div className="p-4 flex-grow min-h-[500px]">
                {tasksByStatus[column.id]?.length > 0 ? (
                  tasksByStatus[column.id].map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`mb-3 ${
                        draggedTask?.id === task.id ? "opacity-50" : ""
                      }`}
                    >
                      <TaskCard task={task} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                    <p>No tasks in this column</p>
                    {(searchQuery || priorityFilter !== "all") &&
                      tasksByStatus[column.id]?.length === 0 && (
                        <p className="text-sm mt-1">
                          Try different filter settings
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={id || ""}
      />
    </div>
  );
};

export default ProjectDetails;
