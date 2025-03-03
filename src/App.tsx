import { useEffect, useState } from "react";
import Kanban from "./Kanban";
import { getColsAndTasks, getProjectFromSlug, getProjects } from "./models/queries";
import { useMainStore } from "./zustand/store";
import { initializeProject } from "./models/init";
import { useNavigate, useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectModal } from "./ProjectModal";
import { Button } from "./components/ui/button";
import { FirstTimeModal } from "./FirstTimeModal";

export default function App() {
	const {
		columns,
		setColumns,
		tasks,
		setTasks,
    setProject,
    setProjects,
    project,
    firstTimeModalShown,
    setFirstTimeModalShown
	} = useMainStore()
  const [ openModal, setOpenModal ] = useState(false)
  const [ openFirst, setOpenFirst ] = useState(false)
  const { projectSlug } = useParams()
  const navigate = useNavigate();

  async function loadTasksAndColumns(projectSlug: string) {
      const loadedProject = await getProjectFromSlug(projectSlug) 
      if (loadedProject) setProject(loadedProject)
      const { tasks, columns } = await getColsAndTasks(projectSlug)
      setColumns(columns)
      setTasks(tasks)
  }
  let counter = 0;

	useEffect(() => {
		async function getData() {
      if (counter >= 1) { return }
      counter += 1;
      const projectInitialized = await initializeProject()
      const projects = await getProjects()
      setProjects(projects)
      if (projectInitialized) {
        console.log("project initialized")
        navigate('my-first-project')
        loadTasksAndColumns('my-first-project')
      }
      if (projectSlug) {
        loadTasksAndColumns(projectSlug)
      }
		}
		getData()
	}, [projectSlug])

  useEffect(()=>{
    const dontShowModal = localStorage.getItem('firstTimeModal')
    if (!firstTimeModalShown && dontShowModal != 'true') {
      setOpenFirst(true)
      setFirstTimeModalShown(true)
    }
  },[])

  if (!projectSlug) {
    return (
      <div className="flex flex-col p-10">
        <div className="">
          <FirstTimeModal openFirst={openFirst} setOpenFirst={setOpenFirst}/>
          <ProjectModal
            openModal={openModal}
            setOpenModal={setOpenModal}
          >
            <Button 
              className="bg-zinc-200 text-black transition-all hover:bg-zinc-100"
              onClick={()=>setOpenModal(true)}
            >
              + Add new project 
            </Button>
          </ProjectModal>
        </div>
      </div>
    )   
  }
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
          className="flex flex-col min-h-0 w-full h-full bg-zinc-800"
        >
          <FirstTimeModal openFirst={openFirst} setOpenFirst={setOpenFirst}/>
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

