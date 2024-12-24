import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { v4 as uuid } from "uuid"
import { Column as ColumnType, db, Task } from "./models/db"
import TaskCard from "./TaskCard"
import {  DragState, handleEnd, ParentConfig, performTransfer, SynthDragState } from "@formkit/drag-and-drop"
import { useRef } from "react"

type Props = {
	tasks: Task[]
	column: ColumnType
	columns: ColumnType[]
	taskRef: React.MutableRefObject<Task | null>
}
export default function Column({ tasks, column, taskRef }: Props) {
	const col = useRef<ColumnType | null>(null)
	const newOrder = useRef<Task[]>([])
	const config: Partial<ParentConfig<Task>> = {
		group: "myGroup",
		onDragstart: (data) => {
			taskRef.current = data.draggedNode.data.value as Task
			console.log("onDragstart taskRef", taskRef.current)
		},
		onTransfer: (data) => {
			console.log("onTransfer", data)
			return { ...data, onTargetIndex: 0 }
		},
		performTransfer(data) {
			console.log("performTransfer", data)
			performTransfer(data)
		},
		onSort(data) {
			newOrder.current = data.values as Task[]
		},
		handleEnd: (data) => {
			//if (col.current !== column) {
			//	console.log("handleEnd: different column")
			//	return
			//}
			if ((data.draggedNode.data.value as unknown as { project_id: string | null })?.project_id) {
				console.log("NOPE! It's a column", data)
				console.log("NOPE: ", (data.draggedNode.data.value as unknown as { project_id: string | null }).project_id )
				return
			}
			console.log("handleEnd", data)
			async function updateTask(taskId: string, data: DragState<Task> | SynthDragState<Task>) {
				if (col?.current?.id) {
					await db.tasks.update(taskId, { column_id: col.current?.id })
					if (newOrder.current.length === 0) {
						if (tasks.length === 0) {
							await db.tasks.update(taskId, { position: 0 })
						} else {
							await db.tasks.update(taskId, { position: tasks.length })
						}
					}
					if (data.initialParent?.el) handleEnd(data)
				}
			}
			async function sortTasks() {
				for (let i=0; i<newOrder.current.length; i++) {
					await db.tasks
						.update(newOrder.current[i].id, { position: i })
				}
			}
			console.log("handleEnd newOrder", newOrder.current)
			const task = taskRef.current
			if (task && column) {
				col.current = column
				updateTask(task.id, data)
			}
			sortTasks()
		}
	};
	const [ refList, list ] = useDragAndDrop<HTMLUListElement, Task>(tasks, config)

	return (
		<ul 
			className={`
				column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] gap-y-2 rounded-lg
			`}
			ref={refList}
		>
			{column.id.slice(0,5)}
			{list.map((task: Task) => (
				<TaskCard
					task={task} 
					key={uuid()}
				/>
			))}
		</ul>
	)
}
