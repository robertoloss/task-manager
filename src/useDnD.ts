import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { Column } from "./models/db"

type Props = {
	input: Column[]
}
type Output = [
	React.RefObject<HTMLUListElement>, 
	Column[]
]
export default function useDnD({ input } : Props): Output {
	const [refColumns, columnsList] = useDragAndDrop<HTMLUListElement, Column>(
		input,
		{ group: "todoList"}
	)
	return [refColumns, columnsList]
}

