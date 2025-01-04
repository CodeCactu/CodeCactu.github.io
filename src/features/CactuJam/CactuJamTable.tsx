"use client"

import { useRef, useState } from "react"
import Image from "@lib/core/flow/Image"
import { User } from "@fet/auth/useDiscordLinking"
import classes from "./CactuJamTable.module.css"
import cactuJamCategories from "./cactuJamCategories"
import Button from "@lib/core/controls/Button"
import cn from "@lib/core/functions/createClassName"
import Dialog, { useDialogsRootContext } from "@fet/flow/Dialog"
import { PopupResolveButton } from "@lib/popups"

type DragData = {
  row: null | CactuJamRow
  index: number
}

export type CactuJamRow = {
  user: User
}

export type CactuJamTableProps = {}

export default function CactuJamTable() {
  const [ sortedRows, setSortedRows ] = useState( mock )
  const { createPopup } = useDialogsRootContext()
  const dragRef = useRef<DragData>({ row:null, index:0 })
  const handleDragStart = (row:CactuJamRow) => {
    dragRef.current.row = row
  }

  const handleDragEvent = (e:React.DragEvent<HTMLTableRowElement>) => {
    e.dataTransfer.dropEffect = `move`
    e.preventDefault()
  }

  const handleDragOverEvent = (e:React.DragEvent<HTMLTableRowElement>, dragOverRow:CactuJamRow) => {
    handleDragEvent( e )

    const draggingRow = dragRef.current.row
    if (!draggingRow || dragOverRow.user.id === draggingRow.user.id) return

    setSortedRows( sortedRows => {
      const newArr:CactuJamRow[] = []
      let draggingRowBelowDragOver = false

      for (let i = 0;  i < sortedRows.length;  ++i) {
        const row = sortedRows[ i ]

        if (row === draggingRow) {
          draggingRowBelowDragOver = true
          continue
        }

        if (row !== dragOverRow) {
          newArr.push( row )
          continue
        }

        if (draggingRowBelowDragOver) {
          newArr.push( row, draggingRow )
        } else {
          newArr.push( draggingRow, row )
        }
      }

      return newArr
    } )
  }

  const handleVote = () => {
    createPopup( <Dialog>
      <PopupResolveButton onKey="Escape" className={cn( classes.dialogCloseIcon )}>Close</PopupResolveButton>
    </Dialog> )
  }

  return (
    <table className={classes.cactuJamTable}>
      <tbody>
        {
          sortedRows.map( row => (
            <tr key={row.user.id} draggable onDragStart={() => handleDragStart( row )} onDragOver={e => handleDragOverEvent( e, row )}>
              <td className={classes.competitor}>
                <Image width={50} height={50} src={row.user.avatarHref} alt="" />
                {row.user.displayName}
              </td>

              {
                cactuJamCategories.map( category => (
                  <td key={category.name}>
                    <Button className={cn( classes.vote, classes.isMissing )} onClick={handleVote}>
                      <span className={classes.voteValue}>0</span>
                      <span className={classes.voteCategory}>{category.label}</span>
                    </Button>
                  </td>
                ) )
              }
            </tr>
          ) )
        }
      </tbody>
    </table>
  )
}

const mock:CactuJamRow[] = [
  { user:{ id:`1`, displayName:`One`, accentColor:`#aa0000`, avatarHref:`https://placehold.co/50x50/aa0000/ffffff.png` } },
  { user:{ id:`2`, displayName:`Two`, accentColor:`#00aa00`, avatarHref:`https://placehold.co/50x50/00aa00/ffffff.png` } },
  { user:{ id:`3`, displayName:`Three`, accentColor:`#0000aa`, avatarHref:`https://placehold.co/50x50/0000aa/ffffff.png` } },
  { user:{ id:`4`, displayName:`Four`, accentColor:`#aa00aa`, avatarHref:`https://placehold.co/50x50/aa00aa/ffffff.png` } },
]
