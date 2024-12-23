import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { v4 as uuid } from "uuid"
import { Column as ColumnType, db, Task } from "./models/db"
import TaskCard from "./TaskCard"
import {  handleEnd, ParentConfig } from "@formkit/drag-and-drop"
import { useRef } from "react"

type Props = {
	tasks: Task[]
	column: ColumnType
	columns: ColumnType[]
	taskRef: React.MutableRefObject<Task | null>
}
export default function Column({ tasks, column, columns }: Props) {
	const col = useRef<ColumnType | null>(null)
	async function updateTask(taskId: string) {
		await db.tasks.update(taskId, { column_id: col.current?.id }).then((updated) => {
			if (updated) console.log(("yay"))
			else console.log("noooo, cazzoooo!")
		})
	}
	const config: Partial<ParentConfig<Task>> =  {
		group: "myGroup",
		handleEnd: (data) => {
			console.log("porco dioooooo", data)
			const task = data.draggedNode?.data.value as Task
			console.log("porco DUEEEE", task)
			console.log("porco treee", col.current?.id)
			if (task) {
				updateTask(task.id)
				handleEnd(data)
			}
		}
	}
	const [ refList, list ] = useDragAndDrop<HTMLUListElement, Task>(tasks, config)
	config.accepts = (parent) => {
		const colId = parent.el.className.split(' ')[0].split('--')[1]
		const thisCol = columns.filter(col => col.id === colId)[0]
		col.current = thisCol 
		console.log(col.current)
		return true
	}
	//console.log("dropColumn", dropColumn)

	return (
		<ul 
			className={`column-id--${column.id} flex flex-col bg-gray-700 p-4 min-w-[240px] gap-y-2 rounded-lg`}
			ref={refList}
		>
			{column.name}
			{list.map((task: Task) => (
				<TaskCard 
					task={task} 
					key={uuid()}
				/>
			))}
		</ul>
	)
}
