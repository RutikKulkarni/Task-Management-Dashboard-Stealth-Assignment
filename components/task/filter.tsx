"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskFilterProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
}

export default function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Filter:</span>
      <Select value={currentFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter tasks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
