
import { FormEvent, useRef, useState } from "react";
import { db } from "./models/db";
import { v4 as uuid } from "uuid";
import { getCols, getTasks } from "./models/queries";
import { useMainStore } from "./zustand/store";

type Props = {
  project_id: string
}
export default function AddColumn({ project_id }: Props) {
	const refTitle = useRef<HTMLInputElement>(null)
	const [title, setTitle] = useState("")
  const { setColumns } = useMainStore()

	async function addColumn(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

    const columns = await db.columns
      .where("project_id")
      .equals(project_id)
      .filter(t => t.date_deleted === 'null' || !t.date_deleted)
      .toArray()

    console.log(columns)
    const numOfCols = columns.length

		await db.columns.add({
			id: uuid(),
      name: title,
			position: numOfCols,
			project_id,
			date_deleted: 'null',
			date_created: new Date(),
			date_modified: new Date()
		})

		setTitle('')
    const newCols = await getCols(project_id)
    setColumns(newCols)
	}

	return (
		<form 
      className="text-black"
      onSubmit={addColumn}
    >
			<input
				onChange={e => setTitle(e.target.value)}
				value={title}
				ref={refTitle}
				name="task"
			/>
			<button className="bg-green-200">
				Add
			</button>
		</form>
	)
}
