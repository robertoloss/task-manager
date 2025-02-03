import { useEffect } from "react";
import Kanban from "./Kanban";
import { getColsAndTasks, getProject } from "./models/queries";
import { useMainStore } from "./zustand/store";

export default function App() {
	const {
		columns,
		setColumns,
		tasks,
		setTasks,
    setProject,
    project
	} = useMainStore()

	useEffect(() => {
		async function getData() {
      const projectArr = await getProject('052a8ebd-cbf3-4291-bb8f-0d39f2a03589')
      if (projectArr.length === 0) return
      setProject(projectArr[0])

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

