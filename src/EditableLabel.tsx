import { Pencil } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Props = {
  label: string,
  thingId: string,
  action: (thingId: string, newLabel: string) => void
}
export default function EditableLabel({ 
  label, 
  action, 
  thingId,
}
  : Props
) {
  const [ editable, setEditable ] = useState(false)
  const [ inputValue, setInputValue ] = useState(label) 
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(()=>{
    if (editable) inputRef.current?.focus()
  },[editable])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newLabel = inputRef.current?.value || '';
    if (newLabel === "") {
      setEditable(false)
      return
    }
    setEditable(false)
    action(thingId,newLabel)
  }
  useEffect(() => {
    function stopParentKeydown(event: KeyboardEvent) {
      if (event.key === " ") {
        event.stopPropagation(); 
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
    <div className="flex flex-row w-full h-fit font-light">
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
          className="flex flex-row items-center w-full"
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            onBlur={handleSubmit}
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
            type="text"
            maxLength={18}
            onKeyDown={(e)=>{
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.stopPropagation()
              }
            }}
            className="bg-transparent outline-none border-none text-opacity-80"
          />
        </form>
      }
    </div>
  )
}
