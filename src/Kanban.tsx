import Column from "./Column"
import { v4 as uuid } from "uuid"
import { Column as ColumnType, Task } from "./models/db";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useRef } from "react";

type Props = {
	tasks: Task[]
	columns: ColumnType[]
	children?: React.ReactNode
}
export default function Kanban({ columns, tasks, children }: Props) {
	const taskRef = useRef<Task | null>(null)
	const [refColumns, columnsList] = useDragAndDrop<HTMLUListElement, ColumnType>(
		columns,
		{ 
			group: "todoList" ,
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
					{columnsList.map((column: ColumnType) => {
						const thisColsTasks = tasks.filter(task => task.column_id === column.id)

						return (
							<Column 
								columns={columns}
								taskRef={taskRef}
								tasks={thisColsTasks}
								column={column} 
								key={uuid()}
							/>
						)
					})}
				</ul>
			</div>
    </div>
  )
}

