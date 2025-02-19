import { FormEvent, useEffect, useRef, useState } from "react";

type Props = {
  action: (e: FormEvent<HTMLFormElement>, title: string) => Promise<void>
  maxLength?: number
}
export default function AddTaskOrColumn({ action, maxLength }: Props) {
	const refTitle = useRef<HTMLTextAreaElement>(null)
  const refForm = useRef<HTMLFormElement>(null)
	const [ title, setTitle ] = useState("")
  const [ showForm, setShowForm ] = useState(false)

  useEffect(() => {
    if (refTitle.current) {
      refTitle.current.style.height = "auto";
      refTitle.current.style.height = `${refTitle.current.scrollHeight}px`; 
    }
  }, [title]);
  
  useEffect(()=>{
    if (showForm) {
      refTitle.current?.focus();
    }
  },[showForm])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (refForm.current && !refForm.current.contains(event.target as Node)) {
        setShowForm(false);
        setTitle("");
      }
    }
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (title.length === 0) {
      setShowForm(false)
      return
    }
    await action(e, title)
    setTitle('')
    setShowForm(false)
  }

  useEffect(() => {
    function stopParentKeydown(event: KeyboardEvent) {
      if (event.key === " ") {
        event.stopPropagation(); 
      }
    }
    if (showForm) {
      document.addEventListener("keydown", stopParentKeydown, true);
    } else {
      document.removeEventListener("keydown", stopParentKeydown, true);
    }
    return () => {
      document.removeEventListener("keydown", stopParentKeydown, true);
    };
  }, [showForm]);

	return (
    <>
      {!showForm &&
        <div 
          className="flex flex-row gap-2 items-center text-white font-light text-sm cursor-pointer rounded-md hover:bg-gray-800 transition-all px-2 py-1"
          onClick={()=>setShowForm(true)}
        >
          <h1 className="flex h-fit text-xl">
            +
          </h1>
          <h1 className="">
            Add
          </h1>
        </div>
      }
      {showForm && 
        <form 
          className="flex flex-col text-black gap-2 text-sm font-light"
          onSubmit={handleSubmit}
          ref={refForm}
          onKeyDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          onFocus={e => e.stopPropagation()}
        >
          <textarea
            className="flex w-full resize-none h-10 px-2 py-1 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-white focus:ring-1 whitespace-pre-wrap"
            onInput={e => {
              setTitle(e.currentTarget.value)
            }} 
            onKeyDown={e => e.stopPropagation()}
            value={title}
            ref={refTitle}
            name="task"
            maxLength={maxLength || 140}
          />
          <div className="flex flex-row gap-x-4 text-white">
            <button 
              className="flex bg-blue-500 text-white py-1 font-light text-sm px-4 rounded-md cursor-pointer hover:opacity-85 transition-all"
              type="submit"
            >
              Add
            </button>
            <button 
              type="button"
              className="text-light cursor-pointer hover:text-gray-300 transition-all"
              onClick={()=>{
                setShowForm(false)
                setTitle('')
              }}
            >
              X
            </button>
          </div>
        </form>
      }
    </>
	)
}
