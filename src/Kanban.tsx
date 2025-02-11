import Column from "./Column"
import { Column as ColumnType, db, Project, Task } from "./models/db";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useRef, useState } from "react";
import { animations, handleEnd, NodeRecord } from "@formkit/drag-and-drop";
import { getCols } from "./models/queries";
import { useMainStore } from "./zustand/store";
import AddColumn from "./AddColumn";

type Props = {
	tasks: Task[]
	columns: ColumnType[]
	children?: React.ReactNode
  project: Project
}
export default function Kanban({ columns, tasks, children, project }: Props) {
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

  return (
    <div className="w-full h-full p-10 bg-zinc-800 text-white flex flex-col  gap-y-10 overflow-auto">
			{ children }
			<div 
        className="kanban-board flex flex-row h-full max-h-[400px] overgap-4 gap-x-4"
      >
				<ul 
					className="flex flex-row gap-4 h-full"
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
        {showAddColumn && <AddColumn project_id={project.id}/>}
			</div>
    </div>
  )
}

