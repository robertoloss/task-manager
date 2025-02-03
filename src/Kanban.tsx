import Column from "./Column"
import { Column as ColumnType, db, Project, Task } from "./models/db";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useRef } from "react";
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

  useEffect(()=>{
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
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-y-10">
			{ children }
			<div className="kanban-board flex flex-row h-full max-h-[400px] gap-4">
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
        <AddColumn project_id={project.id}/>
			</div>
    </div>
  )
}

