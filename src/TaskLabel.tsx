import { Pencil } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Props = {
  label: string,
  thingId: string,
  action: (thingId: string, newLabel: string) => void
}
export default function TaskLabel({ 
  label, 
  action, 
  thingId,
}
  : Props
) {
  const [ editable, setEditable ] = useState(false)
  const [ inputValue, setInputValue ] = useState(label) 
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(()=>{
    if (editable && textareaRef.current) {
      console.log("here")
      console.log(inputValue)
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
      textareaRef
        .current
        .focus();
      textareaRef
        .current
        .setSelectionRange(
          inputValue.length, 
          inputValue.length
        );
    }
  },[editable, inputValue])

  function coreAction() {
    const newLabel = textareaRef.current?.value || '';
    if (newLabel === "" || newLabel === label) {
      setEditable(false)
      return
    }
    setEditable(false)
    action(thingId,newLabel)
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    coreAction()
  }
  useEffect(() => {
    function stopParentKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case " ":
          event.stopPropagation(); 
          break
        case "Escape":
          setEditable(false)
          break
        case "Enter":
          coreAction()
          break
      }
    }
    if (editable) {
      document.addEventListener("keydown", stopParentKeydown, true);
    } else {
      document.removeEventListener("keydown", stopParentKeydown, true);
    }
    return () => {
      document.removeEventListener("keydown", stopParentKeydown, true);
    };
  }, [editable]);

  return (
    <div className="flex flex-row w-full h-full font-light">
      {!editable &&
        <div 
          className="flex flex-row items-center group cursor-pointer w-fit gap-x-2 hover:opacity-80 transition-all"
          onClick={()=>{ setEditable(true) }}
        >
          <h1 className="flex w-fit whitespace-pre text-wrap break-words">
            { label }
          </h1>
          <Pencil 
            size={12}
            className="group-hover:visible invisible"
          />
        </div>
      }
      {editable &&
        <form
          className="flex flex-row items-center w-full h-full gap-x-2"
          onSubmit={handleSubmit}
        >
          <textarea
            ref={textareaRef}
            onBlur={handleSubmit}
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
            maxLength={140}
            onKeyDown={(e)=>{
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.stopPropagation()
              }
            }}
            className="flex flex-col w-full resize-none bg-transparent outline-none border-none text-opacity-80"
          />
          <div className="invisible">
            <Pencil 
              size={12}
              className="group-hover:visible invisible"
            />
          </div>
        </form>
      }
    </div>
  )
}
