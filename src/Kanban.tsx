import Column from "./Column"
import { Column as ColumnType, db, Task } from "./models/db";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useRef, useState } from "react";
import { handleEnd, NodeRecord } from "@formkit/drag-and-drop";

type Props = {
	tasks: Task[]
	columns: ColumnType[]
	children?: React.ReactNode
}
export default function Kanban({ columns, tasks, children }: Props) {
	const [ columnsState, setColumnsState] = useState(columns)
	const newOrder = useRef<ColumnType[]>([])

	useEffect(()=>{
		setColumnsState(columns)
	},[columns])

	const taskRef = useRef<NodeRecord<Task>| null>(null)
	const [refColumns, columnsList] = useDragAndDrop<HTMLUListElement, ColumnType>(
		columnsState,
		{ 
			group: "Kanban" ,
			onSort(data) {
				newOrder.current = data.values as ColumnType[]
			},
			handleEnd(data) {
				async function sortCols() {
					for (let i=0; i<newOrder.current.length; i++) {
						await db.columns.update(newOrder.current[i].id, { position: i })
					}
					if (data.initialParent?.el) handleEnd(data)
				}
				sortCols()
			}
		},
	) 

	//console.log("Kanban: tasks: ", tasks.map(t => ({name: t.title, pos: t.position, col: t.column_id.slice(0,5)}) ))
	//console.log("Kanban: columns: ", columnsList.map(col => ({ id: col.id.slice(0,5), position: col.position }) ))

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
							const thisColsTasks = tasks.filter(task => task.column_id === column.id)

							return (
								<Column 
									columns={columns}
									taskRef={taskRef}
									tasks={thisColsTasks}
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

