import fetchCactu from "./fetchCactu"

export type CactuJamCategory = {
  name: string
  highestValue: number
}

export function loadCactuJamCategories() {
  return fetchCactu<{ categories: CactuJamCategory[] }>( `/api/games/categories` ).then( r => r.categories )
}
