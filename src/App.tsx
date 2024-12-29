import AddTask from './AddTask';
import { useEffect } from "react";
import Kanban from "./Kanban";
import { getColsAndTasks } from "./models/queries";
import { useMainStore } from "./zustand/store";

export default function App() {
	const {
		columns,
		setColumns,
		tasks,
		setTasks
	} = useMainStore()

	useEffect(() => {
		async function getData() {
			const { tasks, columns } = await getColsAndTasks()
			setColumns(columns)
			setTasks(tasks)
		}
		getData()
	}, [])

	//if (columns.length === 0 || tasks.length === 0) return null
	

  return (
		<Kanban
			columns={columns}
			tasks={tasks}
		>
		</Kanban>
  )
}

