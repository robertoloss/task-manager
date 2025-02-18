import { useEffect } from "react";
import Kanban from "./Kanban";
import { getColsAndTasks, getProject, getProjectFromSlug } from "./models/queries";
import { useMainStore } from "./zustand/store";
import { initializeProject } from "./models/init";
import { useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
	const {
		columns,
		setColumns,
		tasks,
		setTasks,
    setProject,
    project
	} = useMainStore()
  //console.log("App running")
  const { projectSlug } = useParams()

	useEffect(() => {
		async function getData() {
      initializeProject()
      if (projectSlug) {
        const loadedProject = await getProjectFromSlug(projectSlug) 
        if (loadedProject) setProject(loadedProject)
        const { tasks, columns } = await getColsAndTasks(projectSlug)
        setColumns(columns)
        setTasks(tasks)
      }
		}
		getData()
	}, [])

  if (!project || !columns || !tasks) {
    return <div className="bg-zinc-800 flex flex-col w-full h-full"/>
  }

  return (
    <AnimatePresence>
      {
        (project && columns && tasks) &&
        <motion.div
          key="kanban"
          initial={{ opacity: 0,  }}
          animate={{ opacity: 1,  }}
          transition={{ ease: "easeIn", duration: .25 }}
          className="flex flex-col w-full h-full bg-zinc-800"
        >
          <Kanban 
            columns={columns} 
            tasks={tasks}
            project={project}
          />
        </motion.div>
      }
    </AnimatePresence>
  )
}

