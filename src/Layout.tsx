import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useNavigate, useParams } from "react-router"
import { AppSidebar } from "./AppSidebar"
import { useMainStore } from "./zustand/store"
import { useEffect, useState } from "react"
import { deleteProject, getProjectFromSlug, getProjects, updateProjectTitle } from "./models/queries"
import DeleteThing from "./DeleteThing"
import EditableLabel from "./EditableLabel"

export default function Layout() {
  const [ projectName, setProjectName ] = useState('')
  const { projectSlug } = useParams()
  const { 
    setProjects
  } = useMainStore()

  useEffect(()=>{
    async function getProjectName() {
      const project = await getProjectFromSlug(projectSlug || '')
      if (project) setProjectName(project.name)
    }
    getProjectName()
  },[projectSlug])

  useEffect(()=>{
    async function getAndSetProjects() {
      const projectList = await getProjects()
      setProjects(projectList)
    }
    getAndSetProjects()
  },[])

  const navigate = useNavigate()

  async function handleDeleteProject(projectId: string) {
    console.log("deleting project")
    await deleteProject(projectId)
    const projectList = await getProjects()
    setProjects(projectList)
    navigate('/')
  }

  async function handleUpdateProjectTitle(projectSlug: string, newLabel: string) {
    setProjectName(newLabel)
    const updatedProject = await updateProjectTitle({ projectSlug, newLabel })
    const projectList = await getProjects()
    setProjects(projectList)
    navigate(`/${updatedProject?.slug || ''}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="overflow-hidden">
        <div className="flex flex-col w-full h-full bg-zinc-800">
          <header className="bg-zinc-800 text-white flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-row row gap-x-2  w-full justify-between">
              <div className="flex flex-col items-center">
                <EditableLabel
                  thingId={projectSlug || ''}
                  label={projectName}
                  action={handleUpdateProjectTitle}
                />
              </div>
              <div className="w-fit cursor-pointer">
                <DeleteThing
                  action={handleDeleteProject}
                  thingId={projectSlug || ''}
                  title="Delete Project"
                  subTitle="Are you sure you want to delete this project?"
                />
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
