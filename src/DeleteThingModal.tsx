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
  thingId: string,
  title: string,
  subTitle: string,
  action: (thingId:string) => void
}
export function DeleteThingModal({ 
  children, 
  thingId,
  title,
  subTitle,
  action
} : Props) 
{
  const [ open, setOpen ] = useState(false);

  async function handleDeletion() {
    setOpen(false)
    action(thingId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            { title }
          </DialogTitle>
          <DialogDescription>
            { subTitle }
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
