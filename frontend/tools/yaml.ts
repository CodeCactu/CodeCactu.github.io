import { parse } from "yaml"
import type { Plugin } from "vite"

/*
 * Vite plugin: YAML files as modules, `import texts from "./auth.pl.yml"` gives the parsed data (untyped, see yaml.d.ts;
 * the translations' types come from translations/translations.ts). Bun's own `bun test` imports YAML natively.
 */

const YAML_FILE = /\.ya?ml$/

export default function yaml(): Plugin {
  return {
    name: `cactu-yaml`,

    transform( source, id ) {
      if (!YAML_FILE.test( id )) return

      return { code:`export default ${JSON.stringify( parse( source ) )}`, map:null }
    },
  }
}
