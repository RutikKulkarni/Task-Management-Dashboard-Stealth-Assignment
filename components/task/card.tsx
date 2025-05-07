"use client";

import type { Task } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium line-clamp-2">{task.title}</h3>
            <Badge
              className={
                priorityColors[task.priority as keyof typeof priorityColors]
              }
            >
              {task.priority}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {task.description}
            </p>
          )}
          <div className="text-xs text-muted-foreground">
            Created: {formatDate(task.createdAt)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <CiEdit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <AiOutlineDelete className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
