import DeleteThing from "./DeleteThing"
import { db, Task } from "./models/db"
import { getTasks } from "./models/queries"
import { useMainStore } from "./zustand/store"

type Props = {
	task: Task
}
export default function TaskCard({ task }: Props) {
  const { setTasks } = useMainStore()
	async function deleteTask(taskId: string) {
		await db.tasks.update(taskId, { date_deleted: new Date})
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
        flex flex-row flex-grow justify-between p-2 gap-2 bg-gray-500 text-white rounded-md
        border-2 border-gray-500 h-fit w-full hover:border-gray-200 cursor-grab group 
      `} 
		>
      <h1 className="w-full font-light text-sm text-ellipsis text-wrap whitespace-pre"> 
        {task.title} 
      </h1>
      <div className="invisible group-hover:visible">
        <DeleteThing
          thingId={task.id}
          action={deleteTask}
          title="Delete Task"
          subTitle="Are you sure you want to delete this task?"
        />
      </div>
		</li>
	)
}
