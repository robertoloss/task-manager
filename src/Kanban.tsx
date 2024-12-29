import Column from "./Column"
import { Column as ColumnType, db, Task } from "./models/db";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useRef } from "react";
import { handleEnd, NodeRecord } from "@formkit/drag-and-drop";
import { getCols } from "./models/queries";
import { useMainStore } from "./zustand/store";

type Props = {
	tasks: Task[]
	columns: ColumnType[]
	children?: React.ReactNode
}
export default function Kanban({ columns, tasks, children }: Props) {
	const { setColumns } = useMainStore()

  useEffect(()=>{
    setColumnList(columns)
  },[columns])

	const taskRef = useRef<NodeRecord<Task>| null>(null)
	const [refColumns, columnsList, setColumnList] = useDragAndDrop<HTMLUListElement, ColumnType>(
		columns,
		{ 
			group: "Kanban" ,
			handleEnd(data) {
				async function sortCols() {
          const updatePromises = columnsList.map(
            (_,i) => db.columns.update(columnsList[i].id, { position: i }) 
          )
          await Promise.all(updatePromises)
          const newCols = await getCols()
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
			<div className="kanban-board flex flex-row h-full max-h-[400px] gap-10">
				<ul 
					className="flex flex-row gap-10"
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
								/>
							)
					})}
				</ul>
			</div>
    </div>
  )
}

