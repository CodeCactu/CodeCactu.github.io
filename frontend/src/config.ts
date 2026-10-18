import "@fet/serverOnly"
import { prepareConfig } from "@lib/prepareConfig"
import { clientConfig } from "./config.client"

export const [ serverConfig ] = prepareConfig( {
}, { inherited:clientConfig } )
