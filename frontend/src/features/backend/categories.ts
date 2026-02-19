import httpBackend from "./httpBackend"

export type CactuJamCategories = {
  name: string
  highestValue: number
}

export function loadCactuJamCategories() {
  return httpBackend.get<{ categories: CactuJamCategories[] }>( `/games/categories` ).then( r => r.categories )
}
