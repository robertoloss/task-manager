import DeleteThing from "./DeleteThing"
import { db, Task } from "./models/db"
import { getTasks } from "./models/queries"
import { useMainStore } from "./zustand/store"
import TaskModal from "./TaskModal"
import { useState } from "react"
import cleanupDeletedItems from "./models/cleanUp"

type Props = {
	task: Task
}
export default function TaskCard({ task }: Props) {
  const { setTasks } = useMainStore()
  const [ openModal, setOpenModal ] = useState(false)
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
    cleanupDeletedItems()
	}
	return (
    <TaskModal
      openModal={openModal}
      setOpenModal={setOpenModal}
      task={task}
    >
      <li 
        className={`
          flex flex-row justify-between p-2 gap-2 bg-gray-500 text-white rounded-md
          border-2 border-gray-500 w-full h-fit hover:border-gray-200 cursor-pointer group items-center text-wrap
          whitespace-pre-wrap  break-words          
        `} 
      >
        <h1 className="flex w-full break-words font-light text-sm" style={{ wordBreak: 'break-all'}}> 
          {task.title}
        </h1>
        <div className="invisible group-hover:visible"
            onClick={(e)=>e.stopPropagation()}
        >
          <DeleteThing
            thingId={task.id}
            action={deleteTask}
            title="Delete Task"
            subTitle="Are you sure you want to delete this task?"
          />
        </div>
      </li>
    </TaskModal>
	)
          
}
