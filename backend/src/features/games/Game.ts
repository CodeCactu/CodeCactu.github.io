import { promises as fs } from "node:fs"
import loadDiscordUser, { DiscordUser } from "@fet/discord/loadDiscordUser"
import getDiscordAvatarUri from "@fet/discord/getDiscordAvatarUri"

type About = {
  name: string
  id: string
}

export class Game {
  static async getGames() {
    const gamesPath = `./uploads/games`
    const uploadsDir = await fs.readdir( gamesPath ).catch( () => null )
    if (!uploadsDir) throw new Error( `Games uploads directory not found` )

    const games = await Promise.all( uploadsDir.map( async gameDirName => {
      const [ id ] = gameDirName.split( `-` )
      const gamePath = `${gamesPath}/${gameDirName}`
      const [ isThumbnailed, about, discordUser ] = await Promise.all([
        fs.access( `${gamePath}/thumbnail.png` ).then( () => true ).catch( () => false ),
        fs.readFile( `${gamePath}/about.json`, `utf-8` ).then<About>( JSON.parse ),
        fs.readFile( `${gamePath}/discordUser.json`, `utf-8` ).catch( async() => {
          const userStr = JSON.stringify( await loadDiscordUser( id ) )
          await fs.writeFile( `${gamePath}/discordUser.json`,  userStr )
          return userStr
        } ).then<DiscordUser>( JSON.parse ),
      ])

      return {
        author: {
          id,
          name: discordUser.username,
          avatarUri: getDiscordAvatarUri( discordUser.id, discordUser.avatar ),
        },
        thumbnailUri: !isThumbnailed ? null : `/uploads/games/${id}/thumbnail.png`,
        ...about,
      }
    } ) )

    return games
  }
}
