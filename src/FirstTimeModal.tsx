import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { EmailCopiedPopover } from "./EmailedCopiedPopover"

type Props = {
  openFirst: boolean,
  setOpenFirst: (b: boolean) => void
}
export function FirstTimeModal({ openFirst, setOpenFirst }: Props) {
  const [ checkboxValue, setCheckboxValue ] = useState<boolean | 'indeterminate'>(false)
  const [ openCopied, setOpenCopied ] = useState(false)

  function handleCheckboxChange(bool: boolean | 'indeterminate') {
    localStorage.setItem('firstTimeModal', JSON.stringify(bool))
    setCheckboxValue(bool)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  async function handleClickOnEmail() {
    await copyToClipboard("robertoloss@gmail.com")
  }



  return (
    <Dialog open={openFirst} onOpenChange={setOpenFirst}>
      <DialogContent 
        onEscapeKeyDown={(e)=>e.preventDefault()}
        onPointerDownOutside={e=>e.preventDefault()}
        className="sm:max-w-[600px] p-10 [&>button]:hidden"
      >
        <DialogHeader >
          <DialogTitle>Welcome to your local Kanban App!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-between gap-y-10 mt-4">
          <div className="flex flex-col font-light gap-y-4">
            <h1>
              Hi! This is a basic version of a Trello-like Kanban board that runs entirely in your browser! 
            </h1>
            <h1>
              Your data is not sent to an external database—it is stored locally in this browser using <a className="underline cursor-pointer hover:text-blue-700 transition-all" href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" target="_blank">IndexedDB</a>. As a result, you can only access your data from this specific browser.
            </h1>
            <h1>
              This is a minimal and very basic version of the app, which I consider a work in progress. If you have any feedback or feature requests, feel free to reach out at&nbsp;
              <EmailCopiedPopover 
                openCopied={openCopied} 
                setOpenCopied={setOpenCopied}
              >
                <span 
                  className="cursor-pointer hover:text-green-700 transition-all underline" 
                  onClick={handleClickOnEmail}
                >
                  robertoloss@gmail.com  
                </span>
              </EmailCopiedPopover>!
            </h1>
            <h1>
              Happy Kanban-ing! 😁👍
            </h1>
            <h1>
              Roberto
            </h1>
          </div>
          <div className="flex flex-row w-full space-x-2">
            <Checkbox 
              id="show-again" 
              checked={checkboxValue}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show this message again
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={()=>setOpenFirst(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
