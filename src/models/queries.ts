import { Column, db, Project, Task } from "./db"
import { v4 as uuid } from 'uuid'
import { generateProjectSlug } from "./utils"
import cleanupDeletedItems from "./cleanUp"

type Output = {
	tasks: Task[]
	columns: Column[]
}


export async function getColsAndTasks(slug: string): Promise<Output> {
  const dataProject = await db.projects
    .where('slug')
    .equals(slug)
    .toArray()

  if (dataProject.length === 0) return {
    tasks: [],
    columns: []
  }

  const projectId = dataProject[0].id

	const columnsAll = await db.columns
    .where('project_id')
    .equals(projectId)
    .sortBy('position')

  const columns = columnsAll.filter(col => col.date_deleted === 'null')
	
	const tasksAll = await db.tasks
    .where('column_id')
    .anyOf(columns.map(col => col.id))
    .sortBy('position')

  const tasks = tasksAll.filter(task  => task.date_deleted === 'null')

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

export async function getProjects(): Promise<Project[]> {
  const projects = await db.projects
    .where('date_deleted')
    .equals('null')
    .sortBy('position')

  return projects || []
}

export async function getProjectFromSlug(slug: string): Promise<Project | null> {
  const data = await db.projects
    .where('slug')
    .equals(slug)
    .toArray()

  if (data.length > 0) return data[0]
  else return null
}



export async function addProject(projectName: string): Promise<Project> {
  const projectSlug = await generateProjectSlug(projectName)
  const projectId = uuid();
  const newProject: Project = {
    id: projectId,
    name: projectName,
    date_created: new Date(),
    date_modified: new Date(),
    date_deleted: 'null',
    slug:projectSlug 
  } 
  await db.projects.add(newProject);
  return newProject
}

export async function deleteProject(projectId: string) {
  console.log("projectId", projectId)
  const res = await db.projects
    .where('slug')
    .equals(projectId)
    .modify(project => {
      project.date_deleted = new Date
    })
  console.log("res", res)
  cleanupDeletedItems()
}

export async function updateProjectTitle({
  projectSlug,
  newLabel
}: {
  projectSlug: string,
  newLabel: string
}) 
  :Promise<Project | null> 
{
  const newProjectSlug = await generateProjectSlug(newLabel)

  await db.projects
    .where('slug')
    .equals(projectSlug)
    .modify(project => { 
      project.name = newLabel,
      project.slug = newProjectSlug
    })
  const updatedProject = getProjectFromSlug(newProjectSlug)
    
  return updatedProject
}

export async function updateColumnTitle({
  columnId,
  newLabel
}: {
  columnId: string,
  newLabel: string
}) {
  await db.columns
    .where('id')
    .equals(columnId)
    .modify(col => {
      col.name = newLabel
    })
}

export async function updateTaskTitle({
  taskId,
  newLabel
}: {
  taskId: string,
  newLabel: string
}) {
  await db.tasks
    .where('id')
    .equals(taskId)
    .modify(task => {
      task.title = newLabel
    })
}
