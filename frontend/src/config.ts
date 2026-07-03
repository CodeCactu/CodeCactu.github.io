import "@fet/serverOnly"
import { prepareConfig } from "@lib/prepareConfig"
import { clientConfig } from "./config.client.astro"

export const [ serverConfig ] = prepareConfig( {
},{ inherited:clientConfig })
