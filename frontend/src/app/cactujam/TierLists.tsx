"use client"

import Row from "@lib/core/flow/Row"
import { surfaceBackgroundClassName } from "@fet/flow/Surface"
import { saveCactuJamUserVotes, useUserCactuJamUserVotes } from "@fet/backend/votes"
import { CactuJamGame } from "@fet/backend/games"
import { CactuJamCategories } from "@fet/backend/categories"
import { useAuth } from "@fet/auth/useAuth"
import TierList, { DragAreaLists, OverviewAnchor } from "@fet/TierList"
import { cactuJamCategories } from "./cactuJamCategories"
import classes from "./TierLists.module.css"

export type TierListsProps = {
  games: CactuJamGame[]
  categories: CactuJamCategories[]
}


export default function TierLists({ games, categories }:TierListsProps) {
  const [ user ] = useAuth({ required:true })
  const userVotes = useUserCactuJamUserVotes( !!user )

  const handleDragEnd = (categoryName:string, lists:DragAreaLists) => {
    saveCactuJamUserVotes({ [ categoryName ]:lists })
  }

  return userVotes.isPending || !userVotes.data ? `Loading...` : (
    <Row gap={24}>
      <OverviewAnchor />

      <div className={classes.lists}>
        {
          categories.map( category => {
            if (!userVotes.data[ category.name ]) return null

            const categoryDescription = cactuJamCategories.find( c => c.name === category.name )
            if (!categoryDescription) return null

            return (
              <div key={category.name}>
                <div className={surfaceBackgroundClassName} />

                <div>
                  <h2>{categoryDescription.label}</h2>

                  <TierList
                    key={category.name}
                    items={games}
                    highestValue={category.highestValue}
                    assignements={userVotes.data[ category.name ]}
                    onDragEnd={lists => handleDragEnd( category.name, lists )}
                  />
                </div>
              </div>
            )
          } )
        }
      </div>
    </Row>
  )
}
