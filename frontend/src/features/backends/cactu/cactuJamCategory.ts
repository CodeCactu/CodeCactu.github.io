import fetchCactu from "./fetchCactu"

export type CactuJamCategories = {
  name: string
  highestValue: number
}

export function loadCactuJamCategories() {
  return fetchCactu<{ categories: CactuJamCategories[] }>( `/api/games/categories` ).then( r => r.categories )
}
