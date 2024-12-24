import { FormEvent, useRef, useState } from "react";
import { db } from "./models/db";
import { v4 as uuid } from "uuid";


export default function AddTask() {
	const refTitle = useRef<HTMLInputElement>(null)
	const [title, setTitle] = useState("")
	function addTask(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		db.tasks.add({
			id: uuid(),
			title,
			position: 0,
			column_id: '356aea27-d14f-4e5c-a2b7-72b19b982630',
			date_deleted: 'null',
			date_created: new Date(),
			date_modified: new Date()
		})
		setTitle('')
	}

	return (
		<form onSubmit={addTask}>
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
