import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useLoaderData } from "react-router"
import { Project } from "./models/db"
import { ProjectModal } from "./ProjectModal"
import { Button } from "./components/ui/button"
import { useState } from "react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const projects: Project[] = useLoaderData()
  const [ openModal, setOpenModal ] = useState(false);
  const sharedTw = "bg-zinc-800 text-white"

  return (
    <Sidebar {...props}>
      <SidebarHeader className={sharedTw}>
      </SidebarHeader>
      <SidebarContent className={sharedTw}>
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-500">
            My Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map(project => (
                <SidebarMenuButton>
                  <a href={project.name}>{project.name}</a>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={sharedTw}>
        <ProjectModal
          openModal={openModal}
          setOpenModal={setOpenModal}
        >
          <Button 
            className="bg-zinc-200 text-black transition-all hover:bg-zinc-100"
            onClick={()=>setOpenModal(true)}
          >
            New+
          </Button>
        </ProjectModal>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
