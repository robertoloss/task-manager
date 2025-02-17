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
        flex flex-row flex-grow justify-between p-4 gap-4 bg-gray-500 text-white rounded-md
        border-2 border-gray-500 max-h-[64px] w-full hover:border-gray-200 cursor-grab group 
      `} 
		>
      {false && <h1>
        <span className="text-yellow-300">
          {task.position}
        </span>
        -{task.title}
      </h1>}
      {true && 
        <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap"> 
          {task.title} 
        </h1>
      }
      <div className="hidden group-hover:block">
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
