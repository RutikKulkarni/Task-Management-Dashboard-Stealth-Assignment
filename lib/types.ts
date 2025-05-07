import { User as CustomUser } from "@/lib/types";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export type TaskStatus = "todo" | "in-progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export type TaskColumn = {
  id: TaskStatus;
  title: string;
  tasks: Task[];
};
