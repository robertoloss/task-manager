import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getColsAndTasks, updateTaskTitle } from "./models/queries"
import { useRef, useState } from "react"
import { useMainStore } from "./zustand/store"
import EditableLabel from "./EditableLabel"
import { Task } from "./models/db"
import TaskLabel from "./TaskLabel"

type Props = {
  openModal: boolean,
  setOpenModal: (b: boolean)=> void,
  children: React.ReactNode
  task: Task
}
export default function TaskModal({ 
  openModal,
  setOpenModal,
  children,
  task
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ optimisticLabel, updateOptimisticLabel ] = useState(task.title)
  const {
    setColumns,
    setTasks,
    project
  } = useMainStore()

  async function handleTaskUpdate(thingId: string, newLabel: string) {
    if (!project) return
    updateOptimisticLabel(newLabel)
    await updateTaskTitle({
      taskId: thingId,
      newLabel
    })
    const { tasks, columns } = await getColsAndTasks(project.slug)
    setColumns(columns)
    setTasks(tasks)
  }


  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="flex justify-between flex-col sm:max-w-[425px] min-h-[200px]">
        <DialogHeader>
          <DialogDescription>
            Title
          </DialogDescription>
          <DialogTitle>
            <div className="flex flex-col w-full text-lg font-semibold">
              <TaskLabel
                label={optimisticLabel}
                thingId={task.id}
                action={handleTaskUpdate}
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline"
            type="button"
            onClick={()=>setOpenModal(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
