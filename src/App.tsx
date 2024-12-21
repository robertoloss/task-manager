import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import Column from "./Column"
import { v4 as uuid } from "uuid"


export default function App() {

	const columns : string[][] = [
		[
			"Depeche Mode",
			"Duran Duran",
			"Pet Shop Boys",
			"Kraftwerk",
			"Tears for Fears",
			"Spandau Ballet"
	 ],
		[
			"Item"
		],
		[
			"Item"
		],

	]

	const [refColumns, columnsList] = useDragAndDrop<HTMLUListElement,string[]>(
		columns,
		{ group: "todoList"}
	)

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
			<div className="kanban-board flex flex-row gap-10">
				<ul 
					className="flex flex-row gap-10"
					ref={refColumns}>
					{columnsList.map((column: string[]) => (
						<Column column={column} key={uuid()}/>
					))}
				</ul>
			</div>
    </div>
  )
}

