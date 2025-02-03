import { create } from 'zustand'
import { Column, Project, Task } from '../models/db'

type MainStore = {
	columns: Column[],
	setColumns: (cols: Column[]) => void,
	tasks: Task[],
	setTasks: (tasks: Task[]) => void
  project: Project | null,
  setProject: (project: Project) => void
}

export const useMainStore = create<MainStore>()((set) => ({
	columns: [],
	setColumns: (cols) => set({ columns: cols}),
	tasks: [],
	setTasks: (tasks) => set({ tasks: tasks }),
  project: null,
  setProject: (project) => set({ project })
}))
