import { getProjects } from "./queries";

export async function generateProjectSlug(projectName: string) {
  const projects = await getProjects()
  const projectsSlug = projects.map(p => p.slug)

  let projectSlug = projectName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-"); 

  let counter = 1;

  while (projectsSlug.includes(projectSlug)) {
    projectSlug = projectSlug + '-' + counter
    counter++
  }
  return projectSlug
}
