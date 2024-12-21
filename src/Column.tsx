import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { v4 as uuid } from "uuid"

type Props = {
	column: string[]
}
export default function Column({ column }: Props) {
	const [ refList, list ] = useDragAndDrop<HTMLUListElement, string>(
		column,
		{ group: "myGroup" }
	)

	return (
		<ul ref={refList}>
			{list.map((task: string) => (
				<li 
					className="kanban-item text-white" 
					key={uuid()}>
					{task}
				</li>
			))}
		</ul>
	)
}
