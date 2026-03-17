import { HttpManager, normalizeSlashes } from "@lib/http"
import { configClient } from "@/config.client"

const httpBackend = new HttpManager({
  reqMiddleware( config ) {
    if (!config.url.startsWith( `http` )) {
      config.url = `${configClient.BACKEND_ORIGIN}/api/${normalizeSlashes( config.url, { start:false, end:false } )}`
    }

    return config
  },
})

export default httpBackend
