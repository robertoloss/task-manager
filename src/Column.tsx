import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { v4 as uuid } from "uuid"
import { Task } from "./models/db"
import TaskCard from "./TaskCard"

type Props = {
	column: Task[]
}
export default function Column({ column }: Props) {
	const [ refList, list ] = useDragAndDrop<HTMLUListElement, Task>(
		column,
		{ group: "myGroup" }
	)

	return (
		<ul 
			className="flex flex-col bg-gray-700 p-4 min-w-[240px] gap-y-2 rounded-lg"
			ref={refList}
		>
			{list.map((task: Task) => (
				<TaskCard task={task} key={uuid()}/>
			))}
		</ul>
	)
}
