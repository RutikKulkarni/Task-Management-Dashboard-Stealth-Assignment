"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { Task, TaskColumn, TaskStatus } from "@/lib/types";
import TaskCard from "@/components/task/card";
import TaskForm from "@/components/forms/task";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import TaskFilter from "@/components/task/filter";
import { Input } from "@/components/ui/input";

interface TaskBoardProps {
  userId: string;
}

export default function TaskBoard({ userId }: TaskBoardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns: TaskColumn[] = [
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "completed", title: "Completed", tasks: [] },
  ];

  const organizedColumns = columns.map((column) => {
    return {
      ...column,
      tasks: filteredTasks.filter((task) => task.status === column.id),
    };
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;

    if (filter !== "all") {
      result = result.filter((task) => task.status === filter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    setFilteredTasks(result);
  }, [tasks, filter, searchQuery]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (newTask: Omit<Task, "_id">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setIsFormOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const result = await response.json();
      setTasks(tasks.map((task) => (task._id === result._id ? result : task)));
      setEditingTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId as TaskStatus;

    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    setTasks(updatedTasks);

    try {
      const response = await fetch("/api/tasks/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      toast.success(`Task moved to ${newStatus.replace("-", " ")}`);
    } catch (error) {
      console.error("Error updating task status:", error);

      setTasks(tasks);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IoClose className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
          <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
          <Button onClick={() => setIsFormOpen(true)}>
            <LuPlus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 && !isLoading && (
        <div className="text-center py-10 bg-muted/50 rounded-lg">
          <BiSearch className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search or filter criteria"
              : "Create your first task to get started"}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={clearSearch} className="mt-4">
              Clear search
            </Button>
          )}
        </div>
      )}

      {filteredTasks.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {organizedColumns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{column.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    {column.tasks.length}{" "}
                    {column.tasks.length === 1 ? "task" : "tasks"}
                  </span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-muted/50 rounded-lg p-3 min-h-[500px]"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                            >
                              <TaskCard
                                task={task}
                                onEdit={() => setEditingTask(task)}
                                onDelete={() => handleDeleteTask(task._id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {column.tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No tasks in this column
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              // onSubmit={handleUpdateTask}
              onSubmit={(values) => {
                if ("_id" in values) {
                  handleUpdateTask(values);
                }
              }}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
