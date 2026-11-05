import { defaultLanguage, type Language } from "./languages"

/*
 * Every slice keeps its own texts in `_translation/<name>.<language>.yml`, in the shape POEditor imports and exports:
 * nested keys, `{{name}}` placeholders, and a plural as a key holding its CLDR plural forms (in Polish `one`, `few`, `many`,
 * `other`), picked by `count`:
 *
 *   gameCount:
 *     one: "{{count}} gra"
 *     few: "{{count}} gry"
 *     many: "{{count}} gier"
 *     other: "{{count}} gry"
 *
 * `bun run translations:generate` writes `_translation/index.ts` beside them: the texts of every language and their one
 * type. The slice turns it into its `t`: `const t = createTranslator( translation )`.
 */

type Texts = { [ key:string ]: string | Texts }
type PluralForm = Intl.LDMLPluralRule
type Params = Record<string, string | number>

/** A slice's texts in every language, as its generated `_translation/index.ts` exports them */
export type Translation<Dictionary extends Texts> = Record<Language, Dictionary>

const PLURAL_FORMS = new Set<string>( [ `zero`, `one`, `two`, `few`, `many`, `other` ] satisfies PluralForm[] )

const language:Language = defaultLanguage
const pluralRules = new Intl.PluralRules( language )
const numberFormat = new Intl.NumberFormat( language )

/**
 * The slice's `t`: the text under `key` in the current language, with its `{{placeholders}}` filled from `params`. A plural
 * needs `count`, which picks the form: `t( `nav.home` )`, `t( `gameCount`, { count:3 } )` (`3 gry`). Keys are typed by the
 * slice's translation; a language the slice lacks falls back to the default one. `t.has( key )` tells whether a text exists,
 * for keys built at run time.
 */
export function createTranslator<Dictionary extends Texts>( translation:Translation<Dictionary> ) {
  const texts:Texts = translation[ language ] ?? translation[ defaultLanguage ]

  const t = <Key extends string>( key:Key extends KeyOf<Dictionary> ? Key : KeyOf<Dictionary>, ...args:ParamsFor<Dictionary, Key> ) => {
    const params = (args as Params[])[ 0 ] ?? {}
    const text = textAt( texts, key, params.count ) ?? key

    return text.replace( /\{\{\s*(\w+)\s*\}\}/g, (placeholder, name:string) => {
      const value = params[ name ]
      if (value === undefined) return placeholder

      return typeof value === `number` ? numberFormat.format( value ) : value
    } )
  }

  // For keys built at run time (from the backend's data): `if (t.has( key )) t( key )`
  const has = (key:string): key is KeyOf<Dictionary> => textAt( texts, key, undefined ) !== undefined

  return Object.assign( t, { has } )
}

/** The text at `path`; for a plural, its form for `count` (or `other`) */
function textAt( texts:Texts, path:string, count:Params[string] | undefined ) {
  let node:string | Texts | undefined = texts

  for (const part of path.split( `.` )) {
    if (typeof node !== `object`) return

    node = node[ part ]
  }

  if (typeof node === `string` || node === undefined) return node
  if (!isPlural( node )) return

  const form = typeof count === `number` ? pluralRules.select( count ) : `other`
  const text = node[ form ] ?? node.other

  return typeof text === `string` ? text : undefined
}

/** A plural: an object whose keys are all CLDR plural forms, `other` among them */
function isPlural( node:Texts ) {
  const keys = Object.keys( node )
  return keys.includes( `other` ) && keys.every( key => PLURAL_FORMS.has( key ) )
}

type IsPlural<Node> = Node extends object
  ? `other` extends keyof Node ? Exclude<keyof Node, PluralForm> extends never ? true : false : false
  : false

/** Every text's key, its path in the texts; a plural is one key: `nav.home`, `gameCount` */
export type KeyOf<Node, Prefix extends string = ``> = {
  [K in keyof Node & string]:Node[K] extends string ? `${Prefix}${K}`
    : IsPlural<Node[K]> extends true ? `${Prefix}${K}`
      : KeyOf<Node[K], `${Prefix}${K}.`>
}[keyof Node & string]

type PluralKeyOf<Node, Prefix extends string = ``> = {
  [K in keyof Node & string]:Node[K] extends string ? never
    : IsPlural<Node[K]> extends true ? `${Prefix}${K}`
      : PluralKeyOf<Node[K], `${Prefix}${K}.`>
}[keyof Node & string]

type ParamsFor<Dictionary, Key extends string> = Key extends PluralKeyOf<Dictionary>
  ? [params:Params & { count: number }]
  : [params?:Params]
