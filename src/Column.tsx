import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Column as ColumnType, db, Task } from "./models/db"
import TaskCard from "./TaskCard"
import { handleEnd } from "@formkit/drag-and-drop"
import { useEffect } from "react"
import { useMainStore } from "./zustand/store"
import { getTasks } from "./models/queries"
import AddTask from "./AddTask"
import { cn } from "./lib/utils"

type Props = {
	tasks: Task[]
	column: ColumnType
}
export default function Column({ tasks, column }: Props) {
	const { setTasks } = useMainStore()

  useEffect(()=>{
    setTaskList(tasks)
  },[tasks])

	const [ refTaskList, taskList, setTaskList ] = useDragAndDrop<HTMLDivElement, Task>(
		tasks, 
    {
      group: "Column",
      handleEnd(data) {
        //console.log("handleEnd",data)
        async function sortTasks() {
          const updatePromises = taskList.map(
            (_,i) => db.tasks.update(
              taskList[i].id, { 
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
	)
  const minHeight = "min-h-[64px]"

	return (
    <div className="flex flex-col h-fit">
		<ul 
			className={`
				column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] gap-y-2 
				rounded-lg ${minHeight} h-full
			`}
		>
      <div className={`handle flex flex-col w-full h-6 bg-blue-300 rounded-lg cursor-grab`}/>
      <div className={`flex flex-col`}>
        {false && <h1>{column.position}-{column.id.slice(0,5)}</h1> }
        {true && <h1>{column.name + ` (${taskList.length})`}</h1> }
      </div>
      <div 
        className={cn(`flex flex-col gap-y-2 h-full ${minHeight} mb-4`, {
            'border-2 border-gray-600 rounded-lg border-dashed items-center justify-center text-gray-600': taskList.length == 0
          })}
        ref={refTaskList}
      >
          {taskList.length == 0 && "Add task here"}
          {taskList.map((task: Task) => (
            <TaskCard
              task={task} 
              key={task.id}
            />
        ))} 
      </div>
			<AddTask column_id={column.id}/>
		</ul>
    </div>
	)
}
