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
import { Input } from "@/components/ui/input"

type Props = {
  openModal: boolean,
  setOpenModal: (b: boolean)=> void,
  children: React.ReactNode
}
export function ProjectModal({ 
  openModal,
  setOpenModal,
  children,
}: Props) {

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            New Project
          </DialogTitle>
          <DialogDescription>
            Choose the name for your new project
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col py-4 w-full">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input 
              name="name-input"
              id="name" 
              placeholder="eg: My awesome new project"
              className="flex flex-row w-full" 
            />
          </div>
        </form>
        <DialogFooter>
          <Button 
            variant="outline"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
