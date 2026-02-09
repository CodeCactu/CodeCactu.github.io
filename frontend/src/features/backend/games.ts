import httpBackend from "./httpBackend"

export function loadCactuJamGames() {
  return httpBackend.get( `/games` )
}
