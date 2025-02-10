import { useEffect } from "react";
import Kanban from "./Kanban";
import { getColsAndTasks, getProject, getProjectsFromSlug } from "./models/queries";
import { useMainStore } from "./zustand/store";
import { initializeProject } from "./models/init";
import { useParams } from "react-router";

export default function App() {
	const {
		columns,
		setColumns,
		tasks,
		setTasks,
    setProject,
    project
	} = useMainStore()
  console.log("App running")
  const { projectId } = useParams()

	useEffect(() => {
		async function getData() {
      initializeProject()
      if (projectId) {
        const loadedProject = await getProjectsFromSlug(projectId) 
        if (loadedProject) setProject(loadedProject)
        const { tasks, columns } = await getColsAndTasks(projectId)
        setColumns(columns)
        setTasks(tasks)
      }
		}
		getData()
	}, [])

  if (!project) return

  return (
		<Kanban 
      columns={columns} 
      tasks={tasks}
      project={project}
    />
  )
}

