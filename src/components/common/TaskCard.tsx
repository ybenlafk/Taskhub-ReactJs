import React, { useState } from "react";
import { format } from "date-fns";
import { Edit, Grip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "../../types/Task";
import TaskFormModal from "./TaskFormModal";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const priorityColors = {
    high: "bg-red-100 text-red-800 hover:bg-red-200",
    medium: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    low: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow transition-all py-2 cursor-grab active:cursor-grabbing">
        <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
          <CardDescription className="flex items-center text-xs text-muted-foreground">
            <Grip className="h-3 w-3 mr-1" />
            {format(new Date(task.createdAt), "MMM d")}
          </CardDescription>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </CardHeader>
        <CardContent className="px-4">
          <h3 className="font-medium mb-1">{task.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        </CardContent>
        <CardFooter className="px-4 py-3 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </CardFooter>
      </Card>

      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={task.projectId}
        taskToEdit={task}
      />
    </>
  );
};

export default TaskCard;
