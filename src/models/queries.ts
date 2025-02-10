import { Column, db, Project, Task } from "./db"

type Output = {
	tasks: Task[]
	columns: Column[]
}

export async function getColsAndTasks(slug: string): Promise<Output> {
  const dataProject = await db.projects
    .where('name')
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

export async function getProjectsFromSlug(slug: string): Promise<Project | null> {
  const data = await db.projects
    .where('name')
    .equals(slug)
    .toArray()

  if (data.length > 0) return data[0]
  else return null
}

export async function addProject(project: Omit<Project, 'slug'>) {
  const projects = await getProjects()
  const projectsSlug = projects.map(p => p.slug)

  let projectSlug = project.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-"); 

  let counter = 1;

  while (projectsSlug.includes(projectSlug)) {
    projectSlug = projectSlug + '-' + counter
    counter++
  }
  const projectToAdd = {
    ...project,
    slug: projectSlug
  }

  const newProject = await db.projects
    .add(projectToAdd)
  console.log("Project added: ", newProject)
}
