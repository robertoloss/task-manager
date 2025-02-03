import { Column, db, Project, Task } from "./db"

type Output = {
	tasks: Task[]
	columns: Column[]
}

export async function getColsAndTasks(): Promise<Output> {
	const columns = await db.columns
    .where('date_deleted')
    .equals('null')
    .sortBy('position')
	
	const tasks = await db.tasks
    .where('date_deleted')
    .equals('null')
    .sortBy('position')

	return { 
		tasks: tasks || [],
		columns: columns || []
	}
}

export async function getProject(projectId: string): Promise<Project[]> {
  const project = await db.projects
    .where('id')
    .equals(projectId)
    .toArray()

  return project
}

export async function getCols(projectId: string): Promise<Column[]> {
	const columns = await db.columns
    .where('project_id')
    .equals(projectId)
    .filter(col => col.date_deleted === 'null')
    .sortBy('position')
	
	return columns || []
}

export async function getTasks(): Promise<Task[]> {
	const tasks = await db.tasks
    .where('date_deleted')
    .equals('null')
    .sortBy('position')

	return tasks || []
}
