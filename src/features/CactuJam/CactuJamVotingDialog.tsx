import Dialog from "@fet/flow/Dialog"
import cn from "@lib/core/functions/createClassName"
import { PopupResolveButton } from "@lib/popups"
import { CactuJamCategory } from "./cactuJamCategories"
import classes from "./CactuJamTable.module.css"

export type CactuJamVotingDialogProps = {
  category: CactuJamCategory
}

export default function CactuJamVotingDialog({ category }:CactuJamVotingDialogProps) {
  return (
    <Dialog>
      <ol>
        {
          category.scale.map( note => (
            <li key={note.value}>
              <PopupResolveButton className={classes.dialogVote} onClick={() => note.value}>
                <p className={classes.dialogVoteValue}>{note.value}</p>
                <p>{note.description}</p>
              </PopupResolveButton>
            </li>
          ) )
        }
      </ol>

      <PopupResolveButton onKey="Escape" className={cn( classes.dialogCloseIcon )}>
        Anuluj
      </PopupResolveButton>
    </Dialog>
  )
}
