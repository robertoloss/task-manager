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
import { useState } from "react"

type Props = {
  children: React.ReactNode
  projectId: string
}
export function DeleteProjectModal({ children, projectId }: Props) {
  const [ open, setOpen ] = useState(false);

  function handleDeletion() {
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            type="button"
            variant="outline"
            onClick={()=>setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDeletion}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
