import { useLiveQuery } from 'dexie-react-hooks';
import { db, Task } from "./models/db";
import Kanban from "./Kanban";
import AddTask from './AddTask';
import { useEffect, useState } from 'react';


export default function App() {
	const columns = useLiveQuery(() => db.tasks.toArray(),[],[]);
	const [oldCols, setOldCols] = useState<Task[]>([])

	useEffect(()=>{
		setOldCols(columns)
	},[columns])

	console.log("Columns in app", columns)

	if (columns.length === 0 || oldCols.length !== columns.length) {
		return (
			<div className="w-screen h-screen flex flex-col items-center justify-center gap-y-10">
				<AddTask/>
			</div>
		)
	}

  return (
		<Kanban columns={columns}>
			<AddTask/>
		</Kanban>
  )
}

