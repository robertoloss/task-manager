import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Task } from "./models/db"

type Props = {
	input: Task[]
}
type Output = [
	React.RefObject<HTMLUListElement>, 
	Task[][]
]
export default function useDnD({ input } : Props): Output {
	const [refColumns, columnsList] = useDragAndDrop<HTMLUListElement, Task[]>(
		[input,[],[]],
		{ group: "todoList"}
	)
	return [refColumns, columnsList]
}

