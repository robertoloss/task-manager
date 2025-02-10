import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useParams } from "react-router"
import { AppSidebar } from "./AppSidebar"

export default function Layout() {
  const { projectId } = useParams()
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="overflow-hidden">
        <div 
          className="flex flex-col w-full h-full"
        >
          <header className="bg-zinc-800 text-white flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1>{projectId}</h1>
          </header>
          <div className="flex flex-col w-[calc(100%-(--sidebar-width))]"/>
          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
