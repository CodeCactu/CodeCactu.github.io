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
import { getAllVotes, getCurrentUserVotes, getJamGames, UserVotes, voteOnGame } from "./gameLoaders"

type DragData = {
  row: null | CactuJamRow
  index: number
}

export type CactuJamRow = {
  user: User
  votes: null | UserVotes
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

  const handleVote = async(user:User, category:CactuJamCategory) => {
    if (!discordUser) return

    const value = await createPopup<number>( <CactuJamVotingDialog category={category} /> )
    const newVotesRes = await voteOnGame( user, category, value )
    const newVotes = newVotesRes.votes

    setSortedRows( rows => !rows ? null : rows.map( row => {
      if (!(row.user.id in newVotes)) return row

      const newRowVotes = newVotes[ row.user.id ]

      return { user:row.user, votes:newRowVotes }
    } ) )
  }

  useEffect( () => {
    Promise.all([
      getJamGames(),
      getCurrentUserVotes(),
    ])
      .then( ([ usersGamesRes, votesRes ]) => {
        const votes = votesRes.success ? votesRes.votes : null
        const userVotes:CactuJamRow[] = Object.values( usersGamesRes.usersGames ).map( userGames => ({
          user: userGames.user,
          votes: !votes ? null : votes[ userGames.user.id ] ?? {},
        }) )

        setSortedRows( userVotes )
      } )
  }, [] )

  useEffect( () => {
    if (discordUser && discordUser.id === `263736841025355777`) getAllVotes().then( console.log )
  }, [ !!discordUser ] )

  return (
    <table className={cn( classes.cactuJamTable, discordUser === false && classes.isWithoutUser )}>
      <tbody>
        {
          !sortedRows ? (
            <tr>
              <td>Ładowanie...</td>
            </tr>
          ) : sortedRows.map( row => (
            <tr key={row.user.id} draggable={!!discordUser} onDragStart={() => handleDragStart( row )} onDragOver={e => handleDragOverEvent( e, row )}>
              <td className={classes.competitor}>
                <Image width={50} height={50} src={`https://cdn.discordapp.com/avatars/${row.user.id}/${row.user.avatarHash}.png`} alt="" />
                {row.user.displayName}
              </td>

              {
                cactuJamCategories.map( category => (
                  <td key={category.name}>
                    <Button
                      disabled={!discordUser || !row.votes}
                      className={cn( classes.vote, row.votes && (!(category.name in row.votes) ? classes.isMissing : classes.isVoted) )}
                      onClick={() => handleVote( row.user, category )}
                    >
                      {row.votes && <span className={classes.voteValue}>{row.votes[ category.name ] ?? 0}</span>}
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
