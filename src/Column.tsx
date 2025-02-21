import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { v4 as uuid } from "uuid"
import { Column as ColumnType, db, Project, Task } from "./models/db"
import TaskCard from "./TaskCard"
import { handleEnd } from "@formkit/drag-and-drop"
import { FormEvent, useEffect, useState } from "react"
import { useMainStore } from "./zustand/store"
import { getCols, getColsAndTasks, getTasks, updateColumnTitle } from "./models/queries"
import { cn } from "./lib/utils"
import DeleteThing from "./DeleteThing"
import EditableLabel from "./EditableLabel"
import AddTaskOrColumn from "./AddTaskColumn"

type Props = {
	tasks: Task[]
	column: ColumnType
  project: Project
}
export default function Column({ tasks, column, project }: Props) {
  const [ optimisticName, updateOptimisticName ] = useState(column.name)
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

  async function handleColumnUpdate(thingId: string, newLabel: string) {
    updateOptimisticName(newLabel)
    await updateColumnTitle({
      columnId: thingId,
      newLabel
    })
    const { tasks, columns } = await getColsAndTasks(project.slug)
    setColumns(columns)
    setTasks(tasks)
  }

	async function addTask(e: FormEvent<HTMLFormElement>, title: string) {
		e.preventDefault()

    const tasks = await db.tasks
      .where("column_id")
      .equals(column.id)
      .filter(t => t.date_deleted === 'null')
      .toArray()

    const numOfTasks = tasks.length

		await db.tasks.add({
			id: uuid(),
			title,
			position: numOfTasks,
			column_id: column.id,
			date_deleted: 'null',
			date_created: new Date(),
			date_modified: new Date()
		})

    const newTasks = await getTasks()
    setTasks(newTasks)
	}

	return (
    <div className="flex flex-col w-fit">
      <ul 
        className={`column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] 
          max-w-[240px] rounded-lg gap-y-2 min-h-[224px]
        `}
      >
        <div className={`handle flex flex-col w-full h-6 bg-gray-800 rounded-lg cursor-grab min-h-4 max-h-4`}/>
        <div className={`flex flex-row py-2 justify-between group`}>
          <div className="flex w-fit">
            <EditableLabel
              label={optimisticName}
              thingId={column.id}
              action={handleColumnUpdate}
            />
          </div>
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
              `custom-scrollbar-tasks max-h-[calc((100vh-64px)-240px)] flex flex-col relative border-pink-600  h-full flex-grow gap-y-2 pb-4 overflow-auto min-h-0`, {
              'border-[1px] font-light p-2 border-gray-600 rounded-lg border-dashed items-center justify-center text-gray-600 mt-2 mb-[16px]': taskList.length === 0
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
        <AddTaskOrColumn action={addTask}/>
      </ul>
    </div>
	)
}
