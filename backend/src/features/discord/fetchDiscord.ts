import config from "@/config"

export default async function fetchDiscord<T>( url:string, init?:RequestInit ) {
  const uri = url.startsWith( `http` ) ? url : `https://discord.com/api/v10${url}`

  return fetch( uri, {
    headers: {
      "Authorization": `Bot ${config.botToken}`,
      "Content-Type": `application/json`,
      ...init?.headers,
    },
    ...init,
  } ).then<T>( r => r.json() )
}
