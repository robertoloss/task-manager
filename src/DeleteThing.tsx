import { Trash2 } from "lucide-react";
import { DeleteThingModal } from "./DeleteThingModal";


type Props = {
  thingId: string,
  title: string,
  subTitle: string,
  action: (thingId:string) => void
}
export default function DeleteThing(props: Props) {
  return (
    <DeleteThingModal {...props}>
      <Trash2 
        strokeWidth="1.5"
        width="16"
        className="cursor-pointer hover:text-destructive"
      />
    </DeleteThingModal>
  )
}
