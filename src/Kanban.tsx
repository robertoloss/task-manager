import Column from "./Column"
import { v4 as uuid } from "uuid"
import { Task } from "./models/db";
import useDnD from "./useDnD";

type Props = {
	columns: Task[]
	children?: React.ReactNode
}
export default function Kanban({ columns, children }: Props) {

	const [refColumns, columnsList] = useDnD({ input: columns }) 
	console.log("columns in Kanban: ", columnsList[0])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-y-10">
			{ children }
			<div className="kanban-board flex flex-row h-full max-h-[400px] gap-10">
				<ul 
					className="flex flex-row gap-10"
					ref={refColumns}>
					{columnsList.map((column: Task[]) => (
						<Column column={column} key={uuid()}/>
					))}
				</ul>
			</div>
    </div>
  )
}

