import { Column, db, Task } from "./db"

type Output = {
	tasks: Task[]
	columns: Column[]
}

export async function getColsAndTasks(): Promise<Output> {
	const columns = await db.columns
			.orderBy('position')
			.toArray()
	
	const tasks = await db.tasks
			.where('date_deleted')
			.equals('null')
			.sortBy('position')

	return { 
		tasks: tasks || [],
		columns: columns || []
	}
}

export async function getCols(): Promise<Column[]> {
	const columns = await db.columns
			.orderBy('position')
			.toArray()
	
	return columns || []
}

export async function getTasks(): Promise<Task[]> {
	const tasks = await db.tasks
			.where('date_deleted')
			.equals('null')
			.sortBy('position')
	
	return tasks || []
}
