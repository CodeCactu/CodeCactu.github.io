import { promises as fs } from "node:fs"
import loadDiscordUser, { DiscordUser } from "@fet/discord/loadDiscordUser"
import getDiscordAvatarUri from "@fet/discord/getDiscordAvatarUri"

export class Game {
  static async getGames() {
    const gamesPath = `./uploads/games`
    const uploadsDir = await fs.readdir( gamesPath ).catch( () => null )
    if (!uploadsDir) throw new Error( `Games uploads directory not found` )

    const games = await Promise.all( uploadsDir.map( async gameDirName => {
      const [ id ] = gameDirName.split( `-` )
      const gamePath = `${gamesPath}/${gameDirName}`
      const isThumbnailed = await fs.access( `${gamePath}/thumbnail.png` ).then( () => true ).catch( () => false )
      const discordUserStr = await fs.readFile( `${gamePath}/discordUser.json`, `utf-8` ).catch( async() => {
        const userStr = JSON.stringify( await loadDiscordUser( id ) )
        await fs.writeFile( `${gamePath}/discordUser.json`,  userStr )
        return userStr
      } )

      const discordUser = JSON.parse( discordUserStr ) as DiscordUser

      return {
        author: {
          id,
          name: discordUser.username,
          avatarUri: getDiscordAvatarUri( discordUser.id, discordUser.avatar ),
        },
        thumbnailUri: !isThumbnailed ? null : `/uploads/games/${id}/thumbnail.png`,
      }
    } ) )

    return games
  }
}
