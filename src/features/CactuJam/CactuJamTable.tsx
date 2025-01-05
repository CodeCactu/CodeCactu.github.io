"use client"

import { useEffect, useRef, useState } from "react"
import Image from "@lib/core/flow/Image"
import cn from "@lib/core/functions/createClassName"
import Button from "@lib/core/controls/Button"
import useDiscordLinking, { User } from "@fet/auth/useDiscordLinking"
import cactuJamCategories, { CactuJamCategory } from "./cactuJamCategories"
import { useDialogsRootContext } from "@fet/flow/Dialog"
import classes from "./CactuJamTable.module.css"
import CactuJamVotingDialog from "./CactuJamVotingDialog"
import { getCurrentUserVotes, voteOnGame } from "./gameLoaders"

type DragData = {
  row: null | CactuJamRow
  index: number
}

export type CactuJamRow = {
  user: User
  votes: Record<string, number>
}

export type CactuJamTableProps = {}

export default function CactuJamTable() {
  const [ sortedRows, setSortedRows ] = useState<null | CactuJamRow[]>( null )
  const { createPopup } = useDialogsRootContext()
  const dragRef = useRef<DragData>({ row:null, index:0 })
  const { discordUser } = useDiscordLinking()

  const handleDragStart = (row:CactuJamRow) => dragRef.current.row = row

  const handleDragEvent = (e:React.DragEvent<HTMLTableRowElement>) => {
    e.dataTransfer.dropEffect = `move`
    e.preventDefault()
  }

  const handleDragOverEvent = (e:React.DragEvent<HTMLTableRowElement>, dragOverRow:CactuJamRow) => {
    handleDragEvent( e )

    const draggingRow = dragRef.current.row
    if (!draggingRow || dragOverRow.user.id === draggingRow.user.id) return

    setSortedRows( sortedRows => {
      if (!sortedRows) return sortedRows

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

  const handleVote = async(category:CactuJamCategory) => {
    if (!discordUser) return

    const value = await createPopup<number>( <CactuJamVotingDialog category={category} /> )
    await voteOnGame( discordUser, category, value ).then( res => console.log( res ) )
  }

  useEffect( () => {
    getCurrentUserVotes().then( votes => {
      const mock:CactuJamRow[] = [
        { user: { id:`1`, displayName:`One`, accentColor:`#aa0000`, avatarHref:`https://placehold.co/50x50/aa0000/ffffff.png` },
          votes,
        },
        { user: { id:`2`, displayName:`Two`, accentColor:`#00aa00`, avatarHref:`https://placehold.co/50x50/00aa00/ffffff.png` },
          votes: cactuJamCategories.reduce( (obj, c, i) => ({ ...obj, [ c.name ]:i }), {} ),
        },
        { user: { id:`3`, displayName:`Three`, accentColor:`#0000aa`, avatarHref:`https://placehold.co/50x50/0000aa/ffffff.png` },
          votes: cactuJamCategories.reduce( (obj, c, i) => ({ ...obj, [ c.name ]:i }), {} ),
        },
        { user: { id:`4`, displayName:`Four`, accentColor:`#aa00aa`, avatarHref:`https://placehold.co/50x50/aa00aa/ffffff.png` },
          votes: cactuJamCategories.reduce( (obj, c, i) => ({ ...obj, [ c.name ]:i }), {} ),
        },
      ]

      setSortedRows( mock )
    } )
  }, [ typeof discordUser ] )

  return (
    <table className={classes.cactuJamTable}>
      <tbody>
        {
          !sortedRows ? (
            <tr>
              <td>Ładowanie...</td>
            </tr>
          ) : sortedRows.map( row => (
            <tr key={row.user.id} draggable onDragStart={() => handleDragStart( row )} onDragOver={e => handleDragOverEvent( e, row )}>
              <td className={classes.competitor}>
                <Image width={50} height={50} src={row.user.avatarHref} alt="" />
                {row.user.displayName}
              </td>

              {
                cactuJamCategories.map( category => (
                  <td key={category.name}>
                    <Button disabled={!discordUser} className={cn( classes.vote, classes.isMissing )} onClick={() => handleVote( category )}>
                      <span className={classes.voteValue}>{row.votes[ category.name ] ?? 0}</span>
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
