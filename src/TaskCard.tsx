import { db, Task } from "./models/db"
import { getTasks } from "./models/queries"
import { useMainStore } from "./zustand/store"

type Props = {
	task: Task
}
export default function TaskCard({ task }: Props) {
  const { setTasks } = useMainStore()
	async function deleteTask() {
		await db.tasks.update(task.id, { date_deleted: new Date})
    await db.tasks
      .where("column_id")
      .equals(task.column_id)
      .filter(t => t.position > task.position)
      .modify(task => { 
        task.position -= 1
      })
    const newTasks = await getTasks()
    setTasks(newTasks)
	}
	return (
		<li 
			className={`
        flex flex-row flex-grow justify-between p-4 gap-4 bg-gray-500 text-white rounded-md
        border-2 border-gray-500 max-h-[64px] 
      `} 
		>
			<h1>
        <span className="text-yellow-300">
          {task.position}
        </span>
        -{task.title}
      </h1>
			<div
				className="cursor-pointer hover:text-red-500"
				onClick={deleteTask}
			>
				X
			</div>
		</li>
	)
}
