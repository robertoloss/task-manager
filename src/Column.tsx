import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Column as ColumnType, db, Task } from "./models/db"
import TaskCard from "./TaskCard"
import { handleEnd, ParentConfig } from "@formkit/drag-and-drop"
import { useEffect } from "react"
import { useMainStore } from "./zustand/store"
import { getTasks } from "./models/queries"

type Props = {
	tasks: Task[]
	column: ColumnType
}
export default function Column({ tasks, column }: Props) {
	const { setTasks } = useMainStore()

  useEffect(()=>{
    setTaskList(tasks)
  },[tasks])

	const config: Partial<ParentConfig<Task>> = {
    group: "Column",
    handleEnd(data) {
      //console.log("handleEnd",data)
      async function sortTasks() {
        const updatePromises = taskList.map(
          (_,i) => db.tasks.update(taskList[i].id, { 
            position: i, 
            column_id: column.id
          }) 
        )
        await Promise.all(updatePromises)
        const newTasks = await getTasks()
        setTasks(newTasks)

        if (data.initialParent?.el) handleEnd(data)
      }
      sortTasks()
    }
  }
		
	const [ refTaskList, taskList, setTaskList ] = useDragAndDrop<HTMLUListElement, Task>(
		tasks, 
		config
	)

	return (
		<ul 
			className={`
				column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] gap-y-2 
				rounded-lg h-fit min-h-[400px]
			`}
			ref={refTaskList}
		>
		{column.position}-{column.id.slice(0,5)}
			{taskList.map((task: Task) => (
				<TaskCard
					task={task} 
					key={task.id}
				/>
			))}
		</ul>
	)
}
