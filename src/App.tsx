import { useLiveQuery } from 'dexie-react-hooks';
import { Column, db, Task } from "./models/db";
import Kanban from "./Kanban";
import AddTask from './AddTask';
import { useEffect, useState } from 'react';
import { initializeProject } from './models/init';


export default function App() {
	const columns = useLiveQuery(() => db.columns.toArray(),[],[] as Column[]);
	const tasks = useLiveQuery(() => db.tasks.toArray(),[],[] as Task[]);

	const [oldCols, setOldCols] = useState<Column[]>([])
	const [oldTasks, setOldTasks] = useState<Task[]>([])

	initializeProject().catch(console.error);

	useEffect(()=>{
		setOldCols(columns)
	},[columns])

	useEffect(()=>{
		setOldTasks(tasks)
	},[tasks])

	let tasksHaveChanged = false;

	for (const task of tasks) {
		let oldTask = oldTasks.filter(t => t.id === task.id)[0]
		if (task?.column_id !== oldTask?.column_id) tasksHaveChanged = true
	}
	
	const notReady = (
		columns.length === 0 || 
		oldCols.length !== columns.length ||
		tasks.length === 0 ||
		oldTasks.length !== tasks.length
		//tasksHaveChanged
	)

	if (notReady) {
		return (
			<div className="w-screen h-screen flex flex-col items-center justify-center gap-y-10">
				<AddTask/>
			</div>
		)
	}

  return (
		<Kanban 
			columns={columns}
			tasks={tasks}
		>
			<AddTask/>
		</Kanban>
  )
}

