import Column from "./Column"
import { v4 as uuid } from "uuid";
import { Column as ColumnType, db, Project, Task } from "./models/db";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { FormEvent, useEffect, useState } from "react";
import { animations, handleEnd } from "@formkit/drag-and-drop";
import { getCols } from "./models/queries";
import { useMainStore } from "./zustand/store";
import AddTaskOrColumn from "./AddTaskColumn";

type Props = {
	tasks: Task[]
	columns: ColumnType[]
  project: Project
}
export default function Kanban({ columns, tasks, project }: Props) {
	const { setColumns } = useMainStore()
  const [ showAddColumn, setShowAddColumn ] = useState(true)

  useEffect(()=>{
    setTimeout(()=>setShowAddColumn(true), 500)
    setColumnList(columns)
  },[columns])

	const [refColumns, columnsList, setColumnList] = useDragAndDrop<HTMLUListElement, ColumnType>(
		columns,
		{ 
			group: "Kanban" ,
      dragHandle: ".handle",
      dropZoneClass: "opacity-50",
      plugins: [
        animations()
      ],
			handleEnd(data) {
				async function sortCols() {
          const updatePromises = columnsList.map(
            (_,i) => db.columns.update(columnsList[i].id, { position: i }) 
          )
          await Promise.all(updatePromises)
          const newCols = await getCols(project.id)
          setColumns(newCols)

					if (data.initialParent?.el) handleEnd(data)
				}
				sortCols()
			}
		},
	) 

  async function addColumn(e: FormEvent<HTMLFormElement>, title: string) {
		e.preventDefault()
    const project_id = project.id

    const columns = await db.columns
      .where("project_id")
      .equals(project_id)
      .filter(t => t.date_deleted === 'null' || !t.date_deleted)
      .toArray()

    const numOfCols = columns.length

		await db.columns.add({
			id: uuid(),
      name: title,
			position: numOfCols,
			project_id,
			date_deleted: 'null',
			date_created: new Date(),
			date_modified: new Date()
		})

    const newCols = await getCols(project_id)
    setColumns(newCols)
	}


  return (
    <div className="this w-full h-full p-10 custom-scrollbar bg-zinc-800 text-white flex flex-row gap-x-4  
      min-h-0 gap-y-10 overflow-auto">
				<ul 
					className="flex flex-row w-fit gap-4 h-full min-h-0"
					ref={refColumns}
				>
					{columnsList
						.map((column: ColumnType) => {
							const thisColTasks = tasks.filter(task => task.column_id === column.id)
							return (
								<Column 
									tasks={thisColTasks}
									column={column} 
									key={column.id}
                  project={project}
								/>
							)
					})}
				</ul>
        {showAddColumn && 
          <div className="flex flex-col min-w-[200px]">
            <AddTaskOrColumn action={addColumn} column={true}/>
          </div>
        }
    </div>
  )
}

