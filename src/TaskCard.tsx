import { db, Task } from "./models/db"

type Props = {
	task: Task
}
export default function TaskCard({ task }: Props) {
	function deleteTask() {
		db.tasks.update(task.id, { date_deleted: new Date})
	}
	return (
		<li 
			className="flex flex-row justify-between p-4 gap-4 bg-gray-500 text-white rounded-md" 
		>
			<h1>{task.title}</h1>
			<div
				className="cursor-pointer hover:text-red-500"
				onClick={deleteTask}
			>
				X
			</div>
		</li>
	)
}
