import { FormEvent, useRef, useState } from "react";
import { db } from "./models/db";


export default function AddTask() {
	const refTitle = useRef<HTMLInputElement>(null)
	const [title, setTitle] = useState("")
	function addTask(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		console.log(title)
		db.tasks.add({
			title,
			deleted: false,
			date_created: new Date()
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
