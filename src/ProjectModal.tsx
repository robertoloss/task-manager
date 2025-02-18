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
import { addProject, getProjects } from "./models/queries"
import { useRef } from "react"
import { useMainStore } from "./zustand/store"
import { useNavigate } from "react-router"

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setProjects } = useMainStore()
  const navigate = useNavigate()

  async function createNewProject() {
    const projectName = inputRef?.current?.value || null 
    if (!projectName) return
    let project = await addProject(projectName as string)
    const newProjects = await getProjects()
    setProjects(newProjects)
    setOpenModal(false)
    navigate(`/${project.slug}`)
  }

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
          <form onSubmit={(e)=>{
            e.preventDefault()
            createNewProject()
          }}>
            <Input 
              ref={inputRef}
              name="name-input"
              id="name" 
              placeholder="eg: My awesome new project"
              className="flex flex-row w-full" 
            />
          </form>
        <DialogFooter>
          <Button 
            variant="outline"
            type="button"
            onClick={()=>setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={createNewProject}
            type="button"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
