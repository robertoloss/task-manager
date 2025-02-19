import { FormEvent, useEffect, useRef, useState } from "react";
import { db } from "./models/db";
import { v4 as uuid } from "uuid";
import { getTasks } from "./models/queries";
import { useMainStore } from "./zustand/store";

type Props = {
  column_id: string
}
export default function AddTask({ column_id }: Props) {
	const refTitle = useRef<HTMLTextAreaElement>(null)
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
  useEffect(() => {
    if (refTitle.current) {
      refTitle.current.style.height = "auto"; // Reset height
      refTitle.current.style.height = `${refTitle.current.scrollHeight}px`; // Set new height
    }
  }, [title]);

	return (
		<form 
      className="flex flex-col text-black gap-2 text-sm font-light"
      onSubmit={addTask}
    >
			<textarea
        className="flex w-full resize-none h-10 px-2 py-1 rounded-md"
				onChange={e => setTitle(e.target.value)}
				value={title}
				ref={refTitle}
				name="task"
        maxLength={140}
			/>
			<button className="bg-green-200">
				Add
			</button>
		</form>
	)
}
