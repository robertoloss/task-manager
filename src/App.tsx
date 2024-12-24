import { db } from "./models/db";
import Kanban from "./Kanban";
import AddTask from './AddTask';
import { useLiveQuery } from "dexie-react-hooks";

export default function App() {
	const columns = useLiveQuery(
		() => db.columns
			.orderBy('position')
			.toArray(),
		[],
	)
	const tasks = useLiveQuery(
		() => db.tasks
			.where('date_deleted')
			.equals('null')
			.sortBy('position'),
		[],
	)

	if (!columns || !tasks) return null 

  return (
		<Kanban 
			columns={columns}
			tasks={tasks}
		>
			<AddTask/>
		</Kanban>
  )
}

