import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect } from "react"

type Props = {
  openCopied: boolean,
  setOpenCopied: (b: boolean) => void
  children: React.ReactNode
}
export function EmailCopiedPopover({ openCopied, setOpenCopied, children }: Props) {

  useEffect(()=>{
    if (openCopied) { 
      setTimeout(()=>setOpenCopied(false), 2000)
    }
  },[openCopied])

  return (
    <Popover 
      open={openCopied} 
      onOpenChange={setOpenCopied}
    >
      <PopoverTrigger asChild>
        { children }
      </PopoverTrigger>
      <PopoverContent 
        side="top"
        sideOffset={4}
        className="w-fit bg-green-50 py-2 px-4 font-light border border-zinc-800"
      >
        <div className="grid gap-4">
          Email copied!
        </div>
      </PopoverContent>
    </Popover>
  )
}
