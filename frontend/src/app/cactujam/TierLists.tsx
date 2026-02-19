"use client"

import { useState } from "react"
import { loadCactuJamUserVotes, CactuJamUserVotes, saveCactuJamUserVotes } from "@fet/backend/votes"
import { CactuJamGame } from "@fet/backend/games"
import { CactuJamCategories } from "@fet/backend/categories"
import { useAuth } from "@fet/auth/useAuth"
import TierList, { DragAreaLists } from "@fet/TierList"

export type TierListsProps = {
  games: CactuJamGame[]
  categories: CactuJamCategories[]
}

export default function TierLists({ games, categories }:TierListsProps) {
  const [ userVotes, setUserVotes ] = useState<CactuJamUserVotes>()
  const [ user ] = useAuth()
  if (user && !userVotes) loadCactuJamUserVotes().then( setUserVotes )

  const handleDragEnd = (categoryName:string, lists:DragAreaLists) => {
    saveCactuJamUserVotes({ [ categoryName ]:lists })
  }

  const category = categories[ 0 ]

  return !userVotes ? `Loading...` : (
    <TierList
      items={games}
      highestValue={category.highestValue}
      assignements={userVotes[ category.name ]}
      onDragEnd={lists => handleDragEnd( category.name, lists )}
    />
  )
}
