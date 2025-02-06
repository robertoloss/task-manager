import { useEffect } from "react";
import Kanban from "./Kanban";
import { getColsAndTasks, getProject } from "./models/queries";
import { useMainStore } from "./zustand/store";
import { initializeProject } from "./models/init";
import { db } from "./models/db";

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

	useEffect(() => {
		async function getData() {
      initializeProject()
      //const projectArr = await getProject('052a8ebd-cbf3-4291-bb8f-0d39f2a03589')
      //if (projectArr.length === 0) return
      //setProject(projectArr[0])

      const firstProject = (await db.projects.toArray())[0]
      setProject(firstProject)
        

			const { tasks, columns } = await getColsAndTasks()
			setColumns(columns)
			setTasks(tasks)
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

