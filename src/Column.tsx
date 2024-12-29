import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Column as ColumnType, db, Task } from "./models/db"
import TaskCard from "./TaskCard"
import { handleEnd } from "@formkit/drag-and-drop"
import { useEffect } from "react"
import { useMainStore } from "./zustand/store"
import { getTasks } from "./models/queries"
import AddTask from "./AddTask"

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

	return (
    <div className="flex flex-col h-fit">
      <ul 
        className={`
          column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] gap-y-2 
          rounded-lg min-h-[400px] flex-grow
        `}
      >
        <AddTask column_id={column.id}/>
        <div 
          className="flex flex-col gap-y-2 h-full min-h-[400px]"
          ref={refTaskList}
        >
          {column.position}-{column.id.slice(0,5)}
            {taskList.map((task: Task) => (
              <TaskCard
                task={task} 
                key={task.id}
              />
          ))} 
        </div>
      </ul>
    </div>
	)
}
