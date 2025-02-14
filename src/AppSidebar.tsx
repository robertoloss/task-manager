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
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ProjectModal } from "./ProjectModal"
import { Button } from "./components/ui/button"
import { useState } from "react"
import { useMainStore } from "./zustand/store"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [ openModal, setOpenModal ] = useState(false);
  const { projects } = useMainStore()
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
              {projects
                .sort((a,b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime())
                .map(project => (
                  <a href={project.slug} key={project.id}>
                    <SidebarMenuButton key={project.id}>
                      <h1>{project.name}</h1>
                    </SidebarMenuButton>
                  </a>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter 
        className={`p-4 ${sharedTw}`}
      >
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
