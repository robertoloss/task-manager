import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Column as ColumnType, db, Project, Task } from "./models/db"
import TaskCard from "./TaskCard"
import { animations, handleEnd } from "@formkit/drag-and-drop"
import { useEffect } from "react"
import { useMainStore } from "./zustand/store"
import { getCols, getTasks } from "./models/queries"
import AddTask from "./AddTask"
import { cn } from "./lib/utils"
import DeleteThing from "./DeleteThing"

type Props = {
	tasks: Task[]
	column: ColumnType
  project: Project
}
export default function Column({ tasks, column, project }: Props) {
	const { 
    setTasks,
    setColumns
  } = useMainStore()

  useEffect(()=>{
    setTaskList(tasks)
  },[tasks])

	const [ refTaskList, taskList, setTaskList ] = useDragAndDrop<HTMLDivElement, Task>(
		tasks, 
    {
      group: "Column",
      draggable(el) {
        return el.id !== 'no-drag'
      },
      dropZoneClass: "opacity-50",
      //selectedClass: "border-yellow-500",
      handleEnd(data){
        //console.log("handleEnd",data)
        const optimisticTasks = taskList.map(
          (task, i) => ({
            ...task, 
            position: i, 
            column_id: column.id
          })
        )
        setTaskList(optimisticTasks)
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
  const minHeight = "min-h-[60px]"
  //const sameLength = tasks.length === taskList.length

	async function deleteColumn(columnId: string) {
    console.log("deleteColumn")
		await db.columns.update(columnId, { date_deleted: new Date})
    await db.columns
      .where("project_id")
      .equals(column.project_id)
      .filter(c => c.position > c.position && c.project_id === project.id)
      .modify(column => { 
        column.position -= 1
      })
    const newCols = await getCols(project.id)
    setColumns(newCols)
	}

	return (
    <div className="flex flex-col h-fit">
		<ul 
			className={`column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] 
				max-w-[240px] rounded-lg ${minHeight} h-full
			`}
		>
      <div className={`handle flex flex-col w-full h-6 bg-blue-300 rounded-lg cursor-grab`}/>
      <div className={`flex group flex-row py-2 justify-between`}>
        <>
          {false && <h1>{column.position}-{column.id.slice(0,5)}</h1> }
          {true && <h1>{column.name + ` (${taskList.length})`}</h1> }
        </>
        <div className="hidden group-hover:block">
          <DeleteThing
            thingId={column.id}
            action={deleteColumn}
            title="Delete Column"
            subTitle="Are you sure you want to delete this column?"
          />
        </div>
      </div>
      <div 
        className={cn(
            `flex flex-col gap-y-2 h-full ${minHeight} pb-4`, {
            'border-2 border-gray-600 rounded-lg border-dashed items-center justify-center text-gray-600 mt-2  pb-0 mb-[16px]': taskList.length === 0
        })}
        ref={refTaskList}
      >
          <div id="no-drag">
            {taskList.length == 0 && 
              <h1>
                Add task here
              </h1>
            }
          </div>
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
