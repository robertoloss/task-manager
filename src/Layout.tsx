import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useParams } from "react-router"
import { AppSidebar } from "./AppSidebar"
import { useMainStore } from "./zustand/store"
import { useEffect } from "react"
import { getProjects } from "./models/queries"
import { DeleteProjectModal } from "./DeleteProjectModal"
import { Trash, Trash2 } from "lucide-react"

export default function Layout() {
  const { projectId } = useParams()
  const { 
    setProjects
  } = useMainStore()

  useEffect(()=>{
    async function getAndSetProjects() {
      const projectList = await getProjects()
      setProjects(projectList)
    }
    getAndSetProjects()
  },[])

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="overflow-hidden">
        <div 
          className="flex flex-col w-full h-full bg-zinc-800"
        >
          <header className="bg-zinc-800 text-white flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-row row gap-x-2 group w-fit cursor-pointer">
              <h1 className="flex w-fit">
                {projectId}
              </h1>
              <div className="w-fit block group-hover:block">
                <DeleteProjectModal>
                  <Trash2 
                    strokeWidth="1.5"
                    width="16"
                  />
                </DeleteProjectModal>
              </div>
            </div>
          </header>
          <div className="flex bg-zinc-800 flex-col w-[calc(100%-(--sidebar-width))]"/>
          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
