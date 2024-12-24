import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Column as ColumnType, db, Task } from "./models/db"
import TaskCard from "./TaskCard"
import {  DragState, handleEnd, NodeRecord, ParentConfig, SynthDragState } from "@formkit/drag-and-drop"
import { useRef } from "react"

type Props = {
	tasks: Task[]
	column: ColumnType
	columns: ColumnType[]
	taskRef: React.MutableRefObject<NodeRecord<Task>| null>
}
export default function Column({ tasks, column, taskRef }: Props) {
	const col = useRef<ColumnType | null>(null)
	const newOrder = useRef<Task[]>([])

	const config: Partial<ParentConfig<Task>> = {
		group: "myGroup",
		onDragstart: (data) => {
			taskRef.current = data.draggedNode as NodeRecord<Task>
		},
		onSort(data) {
			newOrder.current = data.values as Task[]
			//console.log("onSort, newOrder", newOrder.current)
		},
		handleEnd: (data) => {
			if ((data?.draggedNode?.data?.value as unknown as { project_id: string | null })?.project_id) {
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
			const task = taskRef.current
			if (task && column) {
				col.current = column
				updateTask(task.data.value.id, data)
			}
			sortTasks()
			async function sortTasks() {
				for (let i=0; i<newOrder.current.length; i++) {
					await db.tasks
						.update(newOrder.current[i].id, { position: i })
				}
			}
		}
	};
	const [ refList, list ] = useDragAndDrop<HTMLUListElement, Task>(tasks, config)

	return (
		<ul 
			className={`
				column-id--${column.id} text-yellow-400 flex flex-col bg-gray-700  p-4 min-w-[240px] gap-y-2 
				rounded-lg h-fit min-h-[400px]
			`}
			ref={refList}
		>
			{column.id.slice(0,5)}
			{list.map((task: Task) => (
				<TaskCard
					task={task} 
					key={task.id}
				/>
			))}
		</ul>
	)
}
