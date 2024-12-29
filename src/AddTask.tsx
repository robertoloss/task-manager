import { FormEvent, useRef, useState } from "react";
import { db } from "./models/db";
import { v4 as uuid } from "uuid";
import { getTasks } from "./models/queries";
import { useMainStore } from "./zustand/store";

type Props = {
  column_id: string
}
export default function AddTask({ column_id }: Props) {
	const refTitle = useRef<HTMLInputElement>(null)
	const [title, setTitle] = useState("")
  const { setTasks } = useMainStore()

	async function addTask(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

    const tasks = await db.tasks
      .where("column_id")
      .equals(column_id)
      .filter(t => t.date_deleted === 'null')
      .toArray()

    const numOfTasks = tasks.length

		await db.tasks.add({
			id: uuid(),
			title,
			position: numOfTasks,
			column_id,
			date_deleted: 'null',
			date_created: new Date(),
			date_modified: new Date()
		})

		setTitle('')
    const newTasks = await getTasks()
    setTasks(newTasks)
	}

	return (
		<form 
      className="text-black"
      onSubmit={addTask}
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
